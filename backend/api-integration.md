# Guía de Integración API - Home Soluciones

Esta guía detalla las estructuras de datos (JSON) necesarias para alimentar dinámicamente los componentes de la landing page. Cada sección ha sido diseñada para ser "data-driven", facilitando la integración con cualquier CMS o backend personalizado.

---

## 1. Estructura de Datos por Componente

### 1.1 Estadísticas (`Stats.astro`)
Utilizado para mostrar logros numéricos de la empresa.
**Endpoint sugerido:** `/api/stats`

```json
[
  {
    "value": "150+",
    "label": "Proyectos Realizados",
    "sub": "Residenciales & Comerciales"
  },
  {
    "value": "12",
    "label": "Años de Trayectoria",
    "sub": "Excelencia en el mercado"
  }
]
```

### 1.2 Servicios (`Services.astro`)
Lista los servicios principales ofrecidos.
**Endpoint sugerido:** `/api/services`

```json
[
  {
    "title": "Remodelación Integral",
    "desc": "Transformación total de espacios residenciales con acabados de alta gama.",
    "link": "#contacto"
  }
]
```

### 1.3 Showroom / Proyectos (`Showroom.astro`)
Galería visual de proyectos realizados o ambientes curados.
**Endpoint sugerido:** `/api/projects`

```json
[
  {
    "title": "Living Obsidian",
    "category": "Sala Estar",
    "image": "https://tusistema.com/uploads/living.webp"
  }
]
```

### 1.4 Proceso de Trabajo (`Process.astro`)
Pasos del método de trabajo.
**Endpoint sugerido:** `/api/process-steps`

```json
[
  {
    "num": "01",
    "title": "Consultoría Especializada",
    "desc": "Entendemos tu visión y analizamos el potencial del espacio."
  }
]
```

### 1.5 Blog / Conocimiento (`Blog.astro`)
Artículos técnicos y tendencias.
**Endpoint sugerido:** `/api/blog/latest`

```json
[
  {
    "title": "Tendencias en Cocinas Obsidian 2026",
    "date": "24 Abril, 2026",
    "cat": "Diseño",
    "excerpt": "Descubre por qué el negro mate domina la arquitectura moderna."
  }
]
```

---

## 2. Ejemplo de Implementación Técnica (Integración)

Para integrar estas APIs en los componentes Astro, se recomienda reemplazar el arreglo estático por una llamada `fetch` nativa en el frontmatter del componente.

### Ejemplo: Integración en `Services.astro`

```astro
---
// src/components/features/Services.astro
import Button from '../ui/Button.astro';

// 1. Definir la URL de tu API (usando variables de entorno preferiblemente)
const API_URL = import.meta.env.API_URL || 'https://tu-api.com/api';

// 2. Consumir los datos durante la fase de Build (SSG)
const response = await fetch(`${API_URL}/services`);
const services = await response.json();

// 3. (Opcional) Manejo de errores o fallback
if (!services || services.length === 0) {
  console.warn("No se pudieron cargar los servicios.");
}
---

<section id="servicios">
  <!-- El resto del HTML permanece igual, mapeando el arreglo 'services' -->
  {services.map((service, index) => (
    <div>{service.title}</div>
  ))}
</section>
```

> [!TIP]
> **Seguridad:** Recuerda que al usar `fetch` en el frontmatter de Astro (entre los guiones `---`), la llamada se ejecuta en **tiempo de compilación** (servidor). Las credenciales o API Keys no se exponen al cliente a menos que las pases explícitamente a un componente hidratado.

> [!IMPORTANT]
> **Imágenes:** Para un rendimiento óptimo, asegúrate de que las URLs de las imágenes que devuelva el backend apunten a versiones optimizadas (WebP/AVIF) o utiliza un servicio de procesamiento de imágenes.
