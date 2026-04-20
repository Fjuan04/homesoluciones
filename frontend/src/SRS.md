# Software Requirements Specification (SRS) - Landing Page Home Soluciones

## 1. Project Context & Execution Strategy
- **Project Name:** Home Soluciones (Portal de Engagement).
- **Core Industry:** Interior Design, Architectural Carpentry, and Renovations.
- **Location Focus:** Manizales, Colombia.
- **Implementation Strategy:** The project will be built iteratively using a coding agent. Development must strictly follow a **Section-by-Section (Component-Driven)** approach to maintain isolation and simplify debugging.
- **Design System Constraint:** Do NOT define, hardcode, or assume colors, font families, or typography weights in the component logic. These will be managed globally via CSS variables/Tailwind config by the lead developer. Focus purely on layout, spacing proportions, and interactive behaviors.

## 2. Tech Stack & Engineering Standards
### 2.1 Architecture
- **Framework:** Astro 5.0 (Static Site Generation).
- **Styling:** Tailwind CSS 4.0.
- **Network Layer:** Strictly use native `fetch` API.
- **Performance:** 95+ Score on Google PageSpeed Insights.

### 2.2 Coding Best Practices
- **Component Isolation:** Each section detailed in section 4 must be its own `.astro` component.
- **Client-Side JS (`client:load` / `client:visible`):** Use Astro islands sparingly. Only hydrate components that require global event listeners (like the custom cursor) or continuous DOM monitoring (Intersection Observers).
- **Semantic Naming:** Use the term **"Ambientes"** for all references to rooms, spaces, or showroom projects.

## 3. Global Interactive Behaviors (UX/UI)
The coding agent must implement the following global behaviors across the application:
- **Custom Cursor:** Implement a two-part custom cursor (a trailing ring and a solid dot) that follows mouse coordinates (`mousemove`). It must use `requestAnimationFrame` for smooth interpolation.
- **Scroll Reveal Animations:** Implement an `IntersectionObserver` to trigger fade-in and slide-up animations when elements enter the viewport. Elements should support staggered delays (e.g., `reveal-delay-1`, `reveal-delay-2`).
- **Sticky Navigation:** The `<nav>` element must transition its background opacity and padding based on scroll depth (e.g., triggering a `.scrolled` state after 60px).
- **Floating CTA:** A persistent CTA button must appear (fade/slide in) only after the user scrolls past the Hero section (e.g., 400px scroll depth).

## 4. Component Breakdown & Layout Specifications
The landing page must be built section-by-section in the following order:

### 4.1. Navigation (`<Nav />`)
- Fixed positioning at the top.
- Contains Logo, Anchor links to sections, and a primary CTA.
- Behavior: Transparent at top, blurs and shrinks padding on scroll.

### 4.2. Hero Section (`<Hero />`)
- Split 50/50 grid layout (Text/CTAs on left, Visuals on right).
- Eyebrow text with a decorative line.
- Background image layer with a gradient overlay to ensure text readability.
- Animated vertical scroll indicator at the bottom center.

### 4.3. Stats Bar (`<Stats />`)
- 4-column CSS grid displaying numerical achievements (Years, Projects, Satisfaction, Awards).
- Separated by subtle vertical borders.

### 4.4. Services (`<Servicios />`)
- Header with Title and Description.
- 3-column grid for service cards.
- Hover states: Cards must have a bottom-border expansion effect on hover.
- Icons must be SVG-based for crisp scaling.

### 4.5. Process (`<Proceso />`)
- 4-step horizontal timeline layout.
- Steps connected by a continuous horizontal background line.
- Each step contains a numbered node, title, and brief description.

### 4.6. Showroom / Ambientes (`<Proyectos />`)
- **Interaction:** Horizontal scroll layout (`overflow-x: auto`) hiding the default scrollbar.
- Cards must have a fixed width and height.
- Hover states: The background image should subtly scale up, and the gradient overlay should adjust opacity to reveal text.

### 4.7. Technical Blog (`<Blog />`)
- CSS Grid layout emphasizing a "Featured" article spanning two rows, alongside standard articles.
- Each card contains an image placeholder, category tag, title, excerpt, and reading time metadata.
- Bottom CTA linking to the full blog index.

### 4.8. Contact (`<Contacto />`)
- Split grid layout (Information on left, Form on right).
- **Form Requirements:** - Standard inputs (Name, Phone, Email, Project Type select, Textarea).
  - Client-side validation: The phone field must accept standard Colombian formats.
  - Submit button must trigger the native `fetch` API.

### 4.9. Footer (`<Footer />`)
- 3-column grid (Brand, Copyright, Social Links).
- External links must use `target="_blank" rel="noopener noreferrer"`.

## typographic

- Cormorant Garamond (serif editorial, headings) + Jost (sans geométrico limpio, cuerpo). Premium design. (Call via google fonts)

## Graphic Design - Direction:
- Luxury dark editorial — obsidiano. Inspirado en marcas como Fendi Casa o Minotti. No generis colors like white and blue.

## Colors
### Base color
- Red /  base color: #DD2F39

### Dark mode colors
- Black: #1A1814
- Internal sections: #2E2B25

### Light mode colors

- White: #F5EFE6
- Internal sections: #EDE3D5

### Alternative colors
- gray: #EDE3D5
