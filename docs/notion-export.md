# AMPARGO — Documentación del proyecto

Documento único para importar en Notion. Consolida la auditoría, el plan de trabajo, las herramientas instaladas y las decisiones pendientes del cliente.

**Repositorio:** `Alexisz3/EMPRESA-AMPARGO-` · **Rama de trabajo:** `claude/repository-analysis-pwvsh0` · **Base auditada:** commit `f80dcf8` · **Fecha:** 20 de agosto de 2026

---

## 1. Estado del proyecto

| Área | Estado | Nota |
| --- | --- | --- |
| Base técnica | Sólida | Next.js 16, TypeScript estricto, 20 rutas estáticas, checks en verde |
| Captura de leads | **Cerrada** | El formulario devuelve error; sin proveedor de entrega |
| Identidad visual | Plantilla | Tipografía y favicon por defecto de `create-next-app` |
| SEO | Inactivo | Sin dominio no hay canonical, hreflang ni sitemap |
| Contenido bilingüe | Corregido | El H1 en español mostraba texto en inglés |

Sitio web bilingüe (inglés/español) de una empresa real de remodelación y construcción en Houston, Texas. Objetivo comercial único: **generar solicitudes de presupuesto calificadas**.

**Stack:** Next.js 16.3.1 (App Router) · React 19.2.8 · TypeScript estricto · Tailwind CSS 4 · next-intl 4.13

---

## 2. Auditoría — hallazgos

Verificados ejecutando el sitio construido y comprobando el HTML renderizado, no leyendo el código.

| # | Prioridad | Hallazgo | Estado |
| --- | --- | --- | --- |
| 1 | P0 | El formulario de presupuesto no entrega nada | Abierto |
| 2 | P0 | El H1 de la página en español estaba en inglés | **Corregido** |
| 3 | P0 | Sin dominio configurado no hay SEO | Abierto |
| 4 | P1 | Desajuste de hidratación en el visor de proyectos | Abierto |
| 5 | P1 | La CSP lleva `unsafe-inline` en `script-src` | Abierto |
| 6 | P1 | Sin limitación de peticiones | Abierto |
| 7 | P1 | Sin datos estructurados (JSON-LD) | Abierto |
| 8 | P1 | Acento `#d18a62` escrito a mano en tres archivos | Abierto |
| 9 | P2 | Identidad visual por defecto de la plantilla | Abierto |
| 10 | P2 | Cobertura de pruebas mínima | Abierto |

### P0 — El formulario de presupuesto no entrega nada

`src/lib/quote-delivery.ts` devuelve siempre `ok: false` y la ruta responde `503`. Quien rellena el formulario recibe un error. Es la única vía de conversión del sitio y está cerrada.

Es deliberado y correcto — la ADR-008 prohíbe simular una entrega exitosa — pero significa que **el sitio no puede lanzarse hasta implementarlo**.

### P0 — El H1 de la página en español estaba en inglés · CORREGIDO

El titular estaba fijo en el JSX, partido en cuatro líneas para la animación, mientras la versión traducida existía sin usarse en `es.json`. La página `/es` mostraba «Transforming Spaces. Building What Matters.» Los paneles «30+ / Years Experience» y «Houston, TX» tenían el mismo fallo.

El corte de línea vive ahora en los archivos de mensajes (`Hero.titleLines`), porque el español corta en otro sitio y puede necesitar otro número de líneas. La animación no cambia.

### P0 — Sin dominio configurado no hay SEO

Sin `NEXT_PUBLIC_SITE_URL` el sitio se publica sin canonical, sin hreflang, sin URLs en OpenGraph y con sitemap vacío. Para un negocio local que vive de la búsqueda en Houston, equivale a no existir.

### P1 — Desajuste de hidratación en el visor de proyectos

`featured-projects-interactive.tsx:82` lee `matchMedia("prefers-reduced-motion")` en el cuerpo del render. El servidor devuelve siempre `false`; el navegador de quien tiene esa preferencia devuelve `true`, React descarta el HTML del servidor y vuelve a renderizar. Afecta justo a los usuarios con movimiento reducido activado.

### P1 — La CSP lleva `unsafe-inline`

Es lo que Next.js necesita sin configuración de *nonce*, pero desactiva buena parte de la protección contra XSS que la CSP debería aportar.

### P1 — Sin limitación de peticiones

El honeypot y el mínimo de 2,5 segundos son fricción, no protección: la marca de tiempo la envía el propio cliente y se falsifica trivialmente. Con el endpoint aceptando hasta 25 MB por petición, conviene resolverlo junto al proveedor de entrega.

### P1 — Sin datos estructurados y acento fuera del sistema

No hay JSON-LD `LocalBusiness`, que alimenta los resultados locales de Google. Y el acento sobre fondo oscuro `#d18a62` está escrito a mano en `footer.tsx`, `featured-projects-interactive.tsx` y `quote-page-content.tsx`: cuando la paleta se apruebe habrá que cazarlo uno por uno.

### P2 — Identidad y madurez

Geist y Geist Mono son los valores que trae `create-next-app`. El favicon es el de la plantilla y no hay logo. Un solo archivo de tests, sobre validación, sin comprobación automática de paridad de claves entre idiomas — precisamente la clase de fallo que produjo el hallazgo 2.

---

## 3. Plan de trabajo

### Fase 1 — Desbloquear la conversión

Nada más importa hasta que un lead llegue a una bandeja de entrada real.

- [ ] Elegir proveedor de entrega (Resend encaja bien: adjuntos, buen DX, plan gratuito suficiente)
- [ ] Implementarlo **solo** dentro de `deliverQuoteRequest`; la ruta ya trata el resultado correctamente
- [ ] Añadir el origen del proveedor a la CSP en `next.config.ts`
- [ ] Verificar el límite de cuerpo de petición del hosting (Vercel: 4,5 MB por defecto frente a los 25 MB documentados)
- [ ] Probar envío válido con adjuntos, cada rama de validación y el fallo del proveedor
- [ ] Añadir limitación por IP con el almacén compartido del hosting

**Terminado cuando** un envío real desde un móvil llega al buzón de AMPARGO con sus fotos adjuntas, y un envío inválido muestra un error correcto en ambos idiomas.

### Fase 2 — Integridad técnica

- [ ] Corregir el desajuste de hidratación
- [ ] Extraer `--accent-on-dark` como token
- [ ] Añadir un test de paridad de claves EN/ES al conjunto de pruebas
- [ ] Migrar la CSP a *nonce*
- [ ] Configurar `NEXT_PUBLIC_SITE_URL` y verificar canonical, hreflang, robots y sitemap
- [ ] Publicar el JSON-LD `LocalBusiness` cuando dominio y logo estén cerrados

### Fase 3 — Identidad visual

Requiere decisiones del cliente: pídelas al empezar la Fase 1 para que lleguen a tiempo.

- [ ] **Tipografía** — sustituir Geist. Solidez y oficio sin caer en lo rústico: una display con carácter estructural y una de texto que aguante bien el español. Mayor retorno visual por unidad de esfuerzo
- [ ] **Paleta** — completar la base terracota/piedra: neutros elegidos (no gris puro), acento sobre oscuro tokenizado, estados semánticos para el formulario
- [ ] **Logo y favicon** recreados desde la tarjeta de referencia, con aprobación del cliente
- [ ] **Sistema fotográfico** — recorte y punto focal por tipo de proyecto, `blurDataURL` para eliminar el salto de carga, contexto documentado por imagen
- [ ] **Jerarquía del home** — cuánto tarda el visitante en entender qué hace AMPARGO y cuántos desplazamientos hay hasta la primera llamada a la acción

### Fase 4 — Conversión y confianza

Depende de material que el cliente debe aportar. Cada dato que se cierre habilita una sección.

- [ ] Testimonios reales autorizados, mínimo tres con permiso de publicación
- [ ] Pares Antes/Después auténticos del mismo espacio desde ángulo similar
- [ ] Redacción aprobada de garantía, seguro y licencias
- [ ] FAQ, ya redactada en notas internas, a la espera de aprobación
- [ ] Términos del presupuesto inicial gratuito, una vez definido qué cuenta como revisión

> Ninguna de estas secciones se construye con contenido inventado a la espera de sustituirlo. Ese contenido llega a producción.

---

## 4. Skills instaladas en el repositorio

En `.claude/skills/`. Claude Code las carga solo cuando la tarea las toca. No son genéricas: cada regla viene de un fallo real que este repositorio produce.

| Skill | Cubre |
| --- | --- |
| `ampargo-frontend` | Componentes, tokens, sistema de animación `data-reveal`, accesibilidad, imágenes, i18n en la interfaz |
| `ampargo-backend` | Ruta de presupuesto, validación compartida, adaptador de entrega, CSP, variables de entorno, SEO técnico |
| `ampargo-content` | Copy bilingüe, voz de marca, y qué se puede y no se puede publicar según lo confirmado por el cliente |

### Las cuatro invariantes del frontend

1. Ninguna cadena visible vive en un componente — todo pasa por los archivos de mensajes, con juegos de claves idénticos
2. Server Components por defecto — `"use client"` es un coste deliberado
3. La animación va por el sistema `data-reveal`, con su rama de `prefers-reduced-motion`
4. El color viene de tokens semánticos, nunca de hex crudo

### La regla de honestidad del backend

El adaptador de entrega no debe devolver éxito sin que un proveedor real confirme el envío. Un propietario que cree que su solicitud se envió, y no recibe respuesta, es un cliente perdido que piensa que AMPARGO lo ignoró.

---

## 5. Prompt maestro

Archivo completo en `docs/master-prompt.md`, con variantes por tipo de tarea (rediseño de sección, integración de entrega, copy, auditoría).

Puntos que fija en cada sesión:

- Leer `docs/client-confirmed-information.md` y `docs/decisions.md` antes de escribir código
- Verificar en el render, no en el fuente — los fallos de este proyecto son invisibles leyendo componentes
- Server Components por defecto
- Ninguna cadena visible en un componente
- Nada inventado: ni licencias, ni años de experiencia, ni testimonios, ni garantías
- Un cambio, un commit
- Antes de dar algo por terminado: `npm run lint && npm run typecheck && npm run test:validation && npm run build`

---

## 6. Catálogo de skills externas

Stack recomendado, en orden de instalación:

| # | Skill | Por qué |
| --- | --- | --- |
| 1 | **Context7** | `AGENTS.md` avisa de que Next 16.3.1 va por delante del conocimiento del modelo. Resuelve exactamente eso |
| 2 | **emilkowalski/skills** | `review-animations` audita el sistema de animación existente en vez de reescribirlo |
| 3 | **pbakaus/impeccable** | `/impeccable critique` sobre el home — punto 17 del plan |
| 4 | **addyosmani/web-quality-skills** | Cubre los P1 de accesibilidad y SEO técnico |

Comandos de instalación:

```
claude mcp add context7 -s user -- npx -y @upstash/context7-mcp@latest
npx skills@latest add emilkowalski/skills
npx impeccable install
claude plugin add anthropic/frontend-design
```

**Se solapan entre sí — elige una:** `pbakaus/impeccable`, `Leonxlnx/taste-skill`, `nextlevelbuilder/ui-ux-pro-max-skill`. Instalarlas juntas hace que se contradigan.

> **Aviso.** Una skill son instrucciones que Claude sigue, y algunas traen scripts ejecutables. Instalar una skill de un desconocido es ejecutar código de un desconocido en tu máquina y en tu repositorio. Lee el `SKILL.md` antes de instalar.

> **Sobre las estrellas.** Los directorios que indexan estas skills publican cifras infladas (274,9k para superpowers pondría al repo entre los veinte más populares de todo GitHub). Este catálogo no reporta estrellas: la API de GitHub estaba bloqueada y no pude contrastarlas.

---

## 7. Pendientes del cliente

Bloquean las fases 3 y 4 y tienen plazo de respuesta largo. Pedirlos cuanto antes.

- [ ] Dominio definitivo y correo corporativo
- [ ] Logo en vectorial o alta resolución
- [ ] Términos exactos de garantía, con redacción autorizada
- [ ] Detalles de seguro, con redacción autorizada
- [ ] Números y alcance de licencias (eléctrica, fontanería)
- [ ] Tres testimonios con permiso de publicación
- [ ] Pares Antes/Después del mismo espacio
- [ ] Definir qué cuenta como revisión de presupuesto y cuándo se cobra
- [ ] Horario comercial
- [ ] Confirmar disponibilidad de financiación

### Prohibido en copy público hasta cerrar lo anterior

«Licensed & Insured» · «Fully Insured» · duración o cobertura de garantía · «Free Estimates» como afirmación general · financiación · áreas de servicio fuera de Houston · horarios · testimonios y valoraciones · comparaciones Antes/Después · cualquier afirmación de que no hacen falta permisos.

---

## 8. Comandos del proyecto

```
npm run dev              # desarrollo
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run test:validation  # tests de validación del formulario
npm run build            # build de producción
npm run start            # servir el build
```

### Arranque en un ordenador nuevo

```
npm install -g @anthropic-ai/claude-code
git clone https://github.com/Alexisz3/EMPRESA-AMPARGO-
cd EMPRESA-AMPARGO-
git checkout claude/repository-analysis-pwvsh0
npm install
claude
```

Comprobar con `/context` que aparecen las tres skills del repositorio. Luego pegar el prompt maestro y empezar por la Fase 1.

---

## 9. Documentación de referencia en el repositorio

| Archivo | Contenido |
| --- | --- |
| `docs/client-confirmed-information.md` | Fuente de verdad: qué confirmó el cliente y qué se puede publicar |
| `docs/decisions.md` | 18 ADRs con las decisiones de arquitectura vigentes |
| `docs/requirements.md` | Requisitos funcionales y de calidad |
| `docs/production-checklist.md` | Dependencias externas abiertas antes del lanzamiento |
| `docs/design-system.md` | Tokens, tipografía, motion, imágenes |
| `docs/brand.md` | Posicionamiento y principios de voz |
| `docs/redesign-plan.md` | Plan de mejora completo |
| `docs/master-prompt.md` | Prompt maestro y variantes |
