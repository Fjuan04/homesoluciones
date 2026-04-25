import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import puppeteer, { Browser, Page } from 'puppeteer';
import { Cron } from '@nestjs/schedule';

interface ProductVariant {
  thickness?: string;
  price: string;
  sku?: string;
}

interface ScrapedProductData {
  name: string;
  price: string;
  imageUrl: string;
  link: string;
  description?: string;
  variants?: ProductVariant[];
}

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private readonly MAX_PRODUCTS_PER_RUN = 50;

  constructor(private prisma: PrismaService) {}

  @Cron('0 1 * * *') // Todos los días a la 1:00 AM
  async scrapeMadecentro() {
    this.logger.log('Iniciando scraping de madecentro.com');

    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.goto('https://madecentro.com/collections/tableros', {
        waitUntil: 'networkidle2',
      });

      // Esperar a que carguen los productos
      await page.waitForSelector('.productgrid--item', { timeout: 15000 });

      // Extraer información básica de los productos
      let products: ScrapedProductData[] = await page.evaluate(() => {
        const productElements = document.querySelectorAll('.productgrid--item');
        const productsData: ScrapedProductData[] = [];

        productElements.forEach((el) => {
          const nameElement = el.querySelector('.productitem--title a');
          const priceElement = el.querySelector('.productitem__price');
          const imageElement = el.querySelector('.productitem--image-primary');
          const linkElement = el.querySelector('.productitem--image-link');

          const name = nameElement ? nameElement.textContent.trim() : '';
          const price = priceElement ? priceElement.textContent.trim() : '';
          const imageUrl = imageElement ? imageElement.getAttribute('src') : '';
          const link = linkElement ? linkElement.getAttribute('href') : '';

          if (name && price && imageUrl) {
            productsData.push({
              name,
              price,
              imageUrl,
              link: link ? `https://madecentro.com${link}` : '',
            });
          }
        });

        return productsData;
      });

      // Limitar la cantidad de productos por ejecución
      products = products.slice(0, this.MAX_PRODUCTS_PER_RUN);

      // Procesar cada producto para obtener detalles adicionales
      let savedCount = 0;
      for (const product of products) {
        try {
          // Obtener información detallada del producto
          const detailedProduct = await this.getProductDetails(browser, product.link);
          
          // Guardar en base de datos
          const variantsJson = detailedProduct.variants ? JSON.stringify(detailedProduct.variants) : undefined;
          
          await this.prisma.scrapedProduct.upsert({
            where: { link: product.link },
            update: {
              name: detailedProduct.name,
              price: detailedProduct.price,
              imageUrl: detailedProduct.imageUrl,
              description: detailedProduct.description,
              variants: variantsJson as any,
            },
            create: {
              name: detailedProduct.name,
              price: detailedProduct.price,
              imageUrl: detailedProduct.imageUrl,
              link: product.link,
              description: detailedProduct.description,
              variants: variantsJson as any,
            },
          });
          savedCount++;
        } catch (error) {
          this.logger.error(`Error procesando producto ${product.link}:`, error);
          // Guardar el producto con información básica si falla el detalle
          await this.prisma.scrapedProduct.upsert({
            where: { link: product.link },
            update: {
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
            },
            create: {
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              link: product.link,
            },
          });
          savedCount++;
        }
      }

      await browser.close();
      this.logger.log(`Scraping completado. ${savedCount} productos guardados.`);
      return { message: `Scraping completado. ${savedCount} productos guardados.` };
    } catch (error) {
      this.logger.error('Error durante el scraping:', error);
      throw error;
    }
  }

  private async getProductDetails(browser: Browser, productUrl: string): Promise<ScrapedProductData> {
    const page = await browser.newPage();
    try {
      await page.goto(productUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // Esperar a que cargue el formulario del producto
      await page.waitForSelector('.product-form', { timeout: 10000 }).catch(() => {
        this.logger.warn(`No se encontró formulario de producto en ${productUrl}`);
      });

      // Extraer información detallada
      const productData = await page.evaluate(() => {
        // Obtener descripción
        const descriptionElement = document.querySelector('.product-description');
        const description = descriptionElement ? descriptionElement.textContent?.trim() : '';

        // Buscar variantes (espessores y precios)
        const variants: ProductVariant[] = [];
        
        // Buscar información de variantes en el JSON de configuración de producto de Shopify
        const productJson = document.getElementById('ProductJson-collectiontableros');
        if (productJson && productJson.textContent) {
          try {
            const productInfo = JSON.parse(productJson.textContent);
            if (productInfo.variants) {
              productInfo.variants.forEach((variant: any) => {
                // Buscar título que contenga espesor
                const title = variant.title || '';
                const thicknessMatch = title.match(/(\d+mm)/i);
                
                variants.push({
                  thickness: thicknessMatch ? thicknessMatch[1] : title,
                  price: variant.price ? `$${variant.price}` : '',
                  sku: variant.sku || ''
                });
              });
            }
          } catch (e) {
            // Error al parsear JSON
          }
        }

        return {
          name: document.querySelector('h1.product_title')?.textContent?.trim() || '',
          price: document.querySelector('.product-price .money, .price')?.textContent?.trim() || '',
          imageUrl: document.querySelector('.product-single__photos img')?.getAttribute('src') || '',
          link: productUrl,
          description,
          variants: variants.length > 0 ? variants : undefined
        };
      });

      // Si no se encontraron variantes en el JSON, intentar encontrarlas en el DOM
      if (!productData.variants || productData.variants.length === 0) {
        const domVariants = await this.extractVariantsFromDOM(page);
        if (domVariants.length > 0) {
          productData.variants = domVariants;
        }
      }

      return productData;
    } finally {
      await page.close();
    }
  }

  private async extractVariantsFromDOM(page: Page): Promise<ProductVariant[]> {
    const variants: ProductVariant[] = [];
    
    try {
      // Buscar selectores de variantes en el DOM
      const variantSelects = await page.$$('select.single-option-selector');
      
      for (const select of variantSelects) {
        const label = await page.evaluate(el => {
          const parent = el.closest('.selector-wrapper') || el.parentElement;
          return parent?.querySelector('label')?.textContent?.trim() || '';
        }, select);
        
        // Si es un selector de espesor
        if (label.toLowerCase().includes('espesor') || label.toLowerCase().includes('thickness')) {
          const options = await select.$$('option');
          
          for (const option of options) {
            const text = await page.evaluate(el => el.textContent, option);
            
            // Solo procesar opciones válidas que contengan medidas
            if (text && (text.includes('mm') || /\d+mm/i.test(text))) {
              variants.push({
                thickness: text.trim(),
                price: '' // El precio se puede obtener posteriormente si es necesario
              });
            }
          }
        }
      }
    } catch (error) {
      this.logger.error('Error extrayendo variantes del DOM:', error);
    }
    
    return variants;
  }

  async getAllProducts() {
    const products = await this.prisma.scrapedProduct.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Parsear el campo variants de JSON a objeto
    return products.map(product => ({
      ...product,
      variants: product.variants ? JSON.parse(product.variants as string) : null
    }));
  }
}