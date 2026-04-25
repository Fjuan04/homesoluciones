# Módulo de Web Scraping para Madecentro

## Descripción
Este módulo implementa un sistema de web scraping automatizado que recoge diariamente información de productos del sitio web madecentro.com. Los datos recolectados se almacenan en la base de datos para su posterior uso en el módulo de cotización.

## Características

- **Scraping automatizado**: Se ejecuta diariamente a las 01:00 AM
- **Límite de productos**: Máximo 50 productos por ejecución para evitar sobrecarga
- **Datos recolectados**:
  - Nombre del producto
  - Precio
  - Imagen (URL)
  - Enlace directo al producto
- **Almacenamiento**: Base de datos PostgreSQL con modelo dedicado
- **API REST**: Endpoints para consulta y ejecución manual

## Tecnologías utilizadas

- **Puppeteer**: Navegación y scraping de contenido dinámico
- **NestJS Schedule**: Programación de tareas cron
- **Prisma ORM**: Interacción con base de datos PostgreSQL

## Estructura del módulo

```
src/modules/scraping/
├── scraping.module.ts      # Definición del módulo
├── scraping.service.ts     # Lógica de scraping y almacenamiento
├── scraping.controller.ts  # Endpoints API
└── docs/
    └── IMPLEMENTATION.md   # Documentación técnica
```

## Modelo de datos

### ScrapedProduct
| Campo     | Tipo   | Descripción                  |
|-----------|--------|------------------------------|
| id        | Int    | Identificador único          |
| name      | String | Nombre del producto          |
| price     | String | Precio del producto          |
| imageUrl  | String | URL de la imagen             |
| link      | String | Enlace al producto (único)   |
| createdAt | DateTime | Fecha de creación          |
| updatedAt | DateTime | Fecha de última actualización |

## Endpoints API

### GET `/api/scraping/products`
Retorna todos los productos scrapeados ordenados por fecha de creación descendente.

**Respuesta:**
```json
[
  {
    "id": 1,
    "name": "Tablero de ejemplo",
    "price": "$150.000",
    "imageUrl": "https://madecentro.com/image.jpg",
    "link": "https://madecentro.com/producto-ejemplo",
    "createdAt": "2023-04-24T10:00:00Z",
    "updatedAt": "2023-04-24T10:00:00Z"
  }
]
```

### POST `/api/scraping/run` (requiere autenticación JWT)
Ejecuta manualmente el proceso de scraping.

**Respuesta:**
```json
{
  "message": "Scraping completado. 15 productos guardados."
}
```

## Configuración del Cron Job

El scraping se ejecuta automáticamente todos los días a la 1:00 AM mediante la expresión cron: `0 1 * * *`

Para probar el scraping manualmente:
```bash
curl -X POST http://localhost:3000/api/scraping/run -H "Authorization: Bearer TU_TOKEN_JWT"
```

## Consideraciones técnicas

1. **Manejo de errores**: El servicio incluye manejo robusto de errores y logging
2. **Límite de tiempo**: Timeout de 15 segundos para carga de página
3. **Headless browser**: Puppeteer ejecuta Chromium sin interfaz gráfica
4. **Actualización inteligente**: UPSERT evita duplicados y actualiza productos existentes
5. **Seguridad**: Flags de sandbox deshabilitados para entornos contenerizados

## Posibles mejoras futuras

- [ ] Agregar scraping de descripciones detalladas
- [ ] Implementar navegación entre páginas de catálogo
- [ ] Agregar categorización de productos
- [ ] Implementar notificaciones de cambios de precio
- [ ] Agregar métricas de seguimiento de scraping