# AMPARGO — Prompt maestro

Prompt de arranque para cada sesión de trabajo sobre este repositorio. Pégalo al abrir Claude Code (o guárdalo como comando propio) antes de pedir cualquier cambio.

Las tres skills del proyecto viven en `.claude/skills/` y se cargan solas cuando la tarea las toca. Este prompt fija el contexto, el estándar de calidad y el orden de trabajo; las skills aportan las reglas técnicas concretas.

---

## Prompt

> Trabajas en **AMPARGO**, el sitio web bilingüe de una empresa real de remodelación y construcción en Houston, Texas. Es Next.js 16 (App Router), React 19, TypeScript estricto, Tailwind 4 y next-intl. El objetivo comercial único del sitio es **generar solicitudes de presupuesto calificadas**; todo lo demás está a su servicio.
>
> **Antes de escribir código**, lee lo que aplique a la tarea:
> - `docs/client-confirmed-information.md` — fuente de verdad sobre qué se puede publicar. Confirmado ≠ autorizado.
> - `docs/decisions.md` — decisiones de arquitectura vigentes. Si vas a contradecir una ADR, dilo explícitamente y propón una ADR nueva; no la ignores en silencio.
> - `docs/design-system.md` y `docs/brand.md` — tokens, tipografía, dirección visual.
> - `AGENTS.md` — esta versión de Next.js difiere de tu conocimiento previo; consulta `node_modules/next/dist/docs/` ante cualquier duda de API.
>
> **Cómo trabajar:**
>
> 1. **Diagnostica antes de proponer.** Lee el código real que vas a tocar. No asumas cómo está implementado algo.
> 2. **Verifica en el render, no en el fuente.** Los fallos de este proyecto son invisibles leyendo componentes: un H1 inglés en la página en español, un desajuste de hidratación, una etiqueta en español desbordando un chip. Levanta el sitio y compruébalo en `/en` y `/es`, a 375px y en escritorio.
> 3. **Server Components por defecto.** `"use client"` es un coste deliberado: solo con estado, efectos o manejadores de eventos, y aislado en el componente más pequeño posible.
> 4. **Ninguna cadena visible vive en un componente.** Todo pasa por `src/messages/en.json` y `es.json`, con juegos de claves idénticos. Donde el diseño parta un texto en varios elementos, el corte va en el archivo de mensajes: el español corta en otro sitio.
> 5. **Nada inventado.** Ni una licencia, ni un año de experiencia, ni un testimonio, ni una garantía que `docs/client-confirmed-information.md` no autorice. Si el diseño pide una fila de sellos de confianza y no hay material aprobado, construye la sección con lo que sí está aprobado —las fotos reales del trabajo— y anota el hueco como pregunta pendiente para el cliente.
> 6. **Un cambio, un commit.** Mensaje que explique el porqué, no el qué.
>
> **Antes de dar algo por terminado**, ejecuta y deja pasar:
>
> ```bash
> npm run lint && npm run typecheck && npm run test:validation && npm run build
> ```
>
> Luego mira el resultado renderizado en ambos idiomas. Si algo falla, dilo con la salida real; no lo describas como terminado.
>
> **Cómo responderme:** ve al grano. Si detectas un problema real en lo que pedí, dilo en una o dos frases y sigue adelante con el trabajo bajo un supuesto explícito. Si algo queda bloqueado, termina todo lo demás y dime exactamente qué dejaste fuera y por qué.

---

## Variantes por tipo de tarea

Añade el bloque que corresponda al final del prompt maestro.

**Rediseño visual de una sección**
> Antes de tocar el CSS, describe en tres líneas la intención de diseño: qué jerarquía quieres, qué debe mirar primero el visitante y qué acción persigue la sección. Trabaja con los tokens semánticos de `globals.css`. Las animaciones van por el sistema `data-reveal` existente, con su rama de `prefers-reduced-motion`. Verifica el resultado en ambos idiomas a 375px antes de darlo por bueno.

**Integración de entrega del formulario**
> Impleméntala únicamente dentro de `deliverQuoteRequest` en `src/lib/quote-delivery.ts`. La ruta ya trata el resultado correctamente. Devuelve `ok: true` solo después de que el proveedor confirme el envío. Añade las variables a `.env.example` y al README, y ajusta la CSP en `next.config.ts` con el origen nuevo. Prueba con `curl` el camino válido, el de validación y el de fallo.

**Copy o traducción**
> Escribe primero el inglés, luego el español como texto original —no como traducción literal—, manteniendo usted. Añade las claves a los dos archivos de mensajes en la misma edición y verifica que los juegos de claves coincidan. Contrasta cada afirmación factual contra `docs/client-confirmed-information.md`.

**Auditoría**
> No cambies nada todavía. Devuelve los hallazgos ordenados por impacto en la conversión de presupuestos, cada uno con: archivo y línea, qué falla, por qué importa para este negocio, y el arreglo concreto. Separa lo que es un fallo real de lo que es preferencia.
