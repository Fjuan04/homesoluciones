# Guía de Integración API - Home Soluciones

Esta guía detalla las estructuras de datos (JSON) necesarias para alimentar dinámicamente los componentes de la landing page. Cada sección ha sido diseñada para ser "data-driven", facilitando la integración con cualquier CMS o backend personalizado.

---

## 1. Autenticación (Solo para CMS Admin)

Las rutas de gestión (POST, PATCH, DELETE) requieren autenticación mediante JWT.

- **Login:** `POST /api/auth/login`
- **Header:** `Authorization: Bearer <token>`

---

## 2. Estructura de Datos por Componente

### 2.1 Estadísticas (`Stats.astro`)
Utilizado para mostrar logros numéricos de la empresa.

**Endpoints:**
- Lista completa: `GET /api/stats`
- Crear: `POST /api/stats` 🔒
- Actualizar: `PATCH /api/stats/:id` 🔒
- Eliminar: `DELETE /api/stats/:id` 🔒

**Estructura:**
```json
{
  "id": 1,
  "value": "150+",
  "label": "Proyectos Realizados",
  "sub": "Residenciales & Comerciales"
}
```

### 2.2 Servicios (`Services.astro`)
Lista los servicios principales ofrecidos.
**Endpoint:** `GET /api/services`

```json
[
  {
    "id": 1,
    "title": "Remodelación Integral",
    "desc": "Transformación total de espacios residenciales con acabados de alta gama.",
    "link": "#contacto"
  }
]
```

### 2.3 Proyectos y Hero (`Showroom.astro` & `Hero.astro`)
Galería visual de proyectos y proyecto destacado para el Hero.

**Endpoints:** 
- Lista completa: `GET /api/projects`
- Proyecto destacado (Hero): `GET /api/projects/featured`

**Estructura del Proyecto:**
```json
{
  "id": 1,
  "title": "Apartamento Obsidian",
  "category": "Arquitectura",
  "image": "https://tusistema.com/uploads/project1.webp",
  "location": "Poblado",
  "city": "Medellín",
  "country": "Colombia",
  "isFeatured": true
}
```

### 2.4 Proceso de Trabajo (`Process.astro`)
Pasos del método de trabajo.
**Endpoint:** `GET /api/process-steps`

```json
[
  {
    "id": 1,
    "num": "01",
    "title": "Consultoría Especializada",
    "desc": "Entendemos tu visión y analizamos el potencial del espacio."
  }
]
```

### 2.5 Blog / Conocimiento (`Blog.astro`)
Artículos técnicos y tendencias.
**Endpoint:** `GET /api/blog/latest`

```json
[
  {
    "id": 1,
    "title": "Tendencias en Cocinas Obsidian 2026",
    "date": "24 Abril, 2026",
    "cat": "Diseño",
    "excerpt": "Descubre por qué el negro mate domina la arquitectura moderna."
  }
]
```

---

## 3. Ejemplo de Implementación Técnica (Integración)

Para integrar estas APIs en los componentes Astro, se recomienda reemplazar el arreglo estático por una llamada `fetch` nativa en el frontmatter del componente.

### Ejemplo: Integración del Proyecto Destacado en `Hero.astro`

```astro
---
// src/components/sections/Hero.astro
const API_URL = import.meta.env.API_URL || 'http://localhost:3000/api';

const response = await fetch(`${API_URL}/projects/featured`);
const featuredProject = await response.json();
---

<section>
  {featuredProject && (
    <>
      <h1>{featuredProject.title}</h1>
      <p>{featuredProject.location}, {featuredProject.city}, {featuredProject.country}</p>
      <img src={featuredProject.image} alt={featuredProject.title} />
    </>
  )}
</section>
```

> [!TIP]
> **Seguridad:** Recuerda que al usar `fetch` en el frontmatter de Astro (entre los guiones `---`), la llamada se ejecuta en **tiempo de compilación** (SSG) o en el servidor (SSR). Las credenciales o API Keys no se exponen al cliente.

> [!IMPORTANT]
> **Imágenes:** Para un rendimiento óptimo, asegúrate de que las URLs de las imágenes que devuelva el backend apunten a versiones optimizadas (WebP/AVIF).
