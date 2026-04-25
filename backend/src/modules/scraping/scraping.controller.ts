import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ScrapingService } from './scraping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('scraping')
export class ScrapingController {
  constructor(private readonly scrapingService: ScrapingService) {}

  @UseGuards(JwtAuthGuard)
  @Post('run')
  runScraping() {
    return this.scrapingService.scrapeMadecentro();
  }

  @Get('products')
  async getScrapedProducts() {
    const products = await this.scrapingService.getAllProducts();
    return products.map(product => ({
      ...product,
      variants: product.variants ? JSON.parse(product.variants as string) : null
    }));
  }
}