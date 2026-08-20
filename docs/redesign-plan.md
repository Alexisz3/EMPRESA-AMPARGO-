# AMPARGO — Plan de mejora y rediseño

Auditoría del estado real del repositorio y plan de trabajo ordenado por impacto en el objetivo del sitio: generar solicitudes de presupuesto.

Fecha: 2026-08-20 · Base: commit `f80dcf8` · Verificado contra el sitio construido y en ejecución, no solo leyendo el código.

## Punto de partida

La base técnica es sólida y está por encima de lo habitual en un sitio de contratista: Next.js 16 con App Router, TypeScript estricto, renderizado estático de las 20 rutas, `lint` / `typecheck` / `build` / tests en verde, cabeceras de seguridad configuradas, validación de formulario compartida entre cliente y servidor con verificación de firma real de archivos, y una disciplina documental (ADRs, información confirmada por el cliente) que evita el problema más caro de este sector: publicar credenciales inventadas.

Los problemas no están en la arquitectura. Están en tres sitios: **el sitio no puede capturar ni un solo lead**, había **una fuga de idioma en la pieza más visible**, y **la identidad visual sigue siendo la plantilla por defecto de Next.js**.

## Hallazgos

### P0 — Bloqueantes del negocio

**1. El formulario de presupuesto no entrega nada.** `src/lib/quote-delivery.ts` devuelve siempre `{ ok: false }` y la ruta responde `503`. Un visitante que rellena el formulario recibe un error. Es la única vía de conversión del sitio y está cerrada.

Esto es deliberado y correcto (ADR-008: no simular una entrega exitosa), pero significa que **el sitio no puede lanzarse hasta implementarlo**. Es la tarea número uno.

**2. El H1 de la página en español estaba en inglés.** `hero.tsx` fijaba el titular en el JSX partido en cuatro líneas, mientras `Hero.title` existía traducido en `es.json` sin que nadie lo usara. `/es` mostraba "Transforming Spaces. Building What Matters."

Corregido en este commit: el corte de línea vive ahora en los archivos de mensajes (`Hero.titleLines`), porque el español corta en otro sitio. Los paneles "30+ / Years Experience" y "Houston, TX" del hero tenían el mismo problema y también se corrigieron.

**3. Sin `NEXT_PUBLIC_SITE_URL` no hay SEO.** Sin esa variable, `getSiteUrl()` devuelve `null` y el sitio se publica sin canonical, sin hreflang, sin URLs en OpenGraph y con un sitemap vacío. Para un negocio local que depende de la búsqueda en Houston, esto es equivalente a no existir. La decisión de no usar el dominio temporal de Vercel es correcta (ADR-018); lo que falta es el dominio real.

### P1 — Calidad e integridad

**4. Desajuste de hidratación en el visor de proyectos.** `featured-projects-interactive.tsx:82-85` lee `window.matchMedia("(prefers-reduced-motion: reduce)")` en el cuerpo del render. El servidor renderiza siempre `false`; el cliente de un usuario con movimiento reducido renderiza `true`. React descarta el HTML del servidor y vuelve a renderizar en cliente. Afecta justo a los usuarios con esa preferencia activada. Debe leerse dentro de `useEffect` y guardarse en estado.

**5. La CSP lleva `'unsafe-inline'` en `script-src`.** Es lo que Next.js necesita sin una configuración de *nonce*, pero desactiva buena parte de la protección contra XSS que la CSP debería dar. Sustituible por una política basada en nonce vía middleware.

**6. Sin limitación de peticiones.** El honeypot y el mínimo de 2.5 segundos son fricción, no protección — y `formStartedAt` lo envía el propio cliente, así que se falsifica trivialmente. ADR-013 ya lo reconoce y difiere la decisión al hosting. Con el endpoint aceptando hasta 25 MB por petición, conviene resolverlo junto con el proveedor de entrega.

**7. Sin datos estructurados.** No hay JSON-LD `LocalBusiness`. Es lo que alimenta el panel de conocimiento y los resultados locales de Google. ADR-014 lo difiere hasta tener identidad final; es la decisión correcta pero tiene fecha de caducidad.

**8. `#d18a62` está escrito a mano en tres archivos.** El acento sobre fondo oscuro (`footer.tsx`, `featured-projects-interactive.tsx`, `quote-page-content.tsx`) escapa al sistema de tokens. Cuando la paleta de marca se apruebe, habrá que cazarlo archivo por archivo. Debe ser un token `--accent-on-dark`.

### P2 — Identidad y madurez

**9. La tipografía es la plantilla de Next.js.** Geist y Geist Mono son los valores por defecto del `create-next-app`, marcados como provisionales en `docs/design-system.md`. Es la decisión aislada que más distancia hay entre "sitio de plantilla" y "sitio con identidad propia".

**10. Sin logo ni favicon.** El favicon es el de la plantilla. El cliente entregó la foto de una tarjeta de visita antigua como referencia, no como activo.

**11. Cobertura de pruebas mínima.** Un archivo de tests, sobre validación. No hay comprobación automática de paridad de claves de traducción — precisamente la clase de fallo que produjo el P0 nº 2.

**12. Sin tema oscuro.** No es un requisito, pero es una expectativa creciente.

## Plan de trabajo

Cuatro fases. Las dos primeras desbloquean el lanzamiento; las dos últimas son el rediseño.

### Fase 1 — Desbloquear la conversión

*Sin esto el sitio no puede lanzarse. Nada más importa hasta que un lead llegue a una bandeja de entrada real.*

1. Elegir proveedor de entrega (Resend encaja bien: adjuntos, buen DX, plan gratuito suficiente para el volumen de un contratista).
2. Implementarlo **solo** dentro de `deliverQuoteRequest`. La ruta ya trata el resultado correctamente.
3. Añadir el origen del proveedor a la CSP en `next.config.ts`.
4. Verificar que el límite de cuerpo de petición del hosting admite los 25 MB documentados — el valor por defecto de Vercel es 4.5 MB y el fallo se ve como un 413 silencioso.
5. Probar de verdad: envío válido con adjuntos, cada rama de validación, y el camino de fallo del proveedor.
6. Añadir limitación de peticiones por IP con el almacén compartido del hosting.

**Terminado cuando:** un envío real desde un móvil llega al buzón de AMPARGO con sus fotos adjuntas, y un envío inválido muestra un error correcto en ambos idiomas.

### Fase 2 — Integridad técnica

*Arreglos acotados, todos con criterio de verificación claro.*

7. Corregir el desajuste de hidratación (hallazgo 4).
8. Extraer `--accent-on-dark` como token (hallazgo 8).
9. Añadir un test de paridad de claves EN/ES al conjunto de pruebas — convierte el fallo del P0 nº 2 en algo que el CI detecta (hallazgo 11).
10. Migrar la CSP a *nonce* (hallazgo 5).
11. Configurar `NEXT_PUBLIC_SITE_URL` en cuanto exista el dominio, y verificar canonical, hreflang, robots y sitemap contra el sitio desplegado (hallazgo 3).
12. Publicar el JSON-LD `LocalBusiness` cuando dominio y logo estén cerrados (hallazgo 7).

### Fase 3 — Identidad visual

*Aquí empieza el rediseño de verdad. Requiere decisiones del cliente, así que conviene pedirlas al empezar la Fase 1 para que lleguen a tiempo.*

13. **Tipografía.** Sustituir Geist. Para un contratista, el par debería transmitir solidez y oficio sin caer en lo rústico: una display con carácter estructural y una de texto de alta legibilidad que aguante bien el español. Es el cambio de mayor retorno visual por unidad de esfuerzo.
14. **Paleta.** La base terracota/piedra actual (`#a35b35` sobre `#f7f5f0`) es defendible y coherente con el material de obra. Necesita completarse: escala de neutros elegida —no gris puro—, acento sobre oscuro tokenizado, y estados semánticos para el formulario.
15. **Logo y favicon.** Recrear la marca a partir de la referencia de la tarjeta, con aprobación del cliente.
16. **Sistema fotográfico.** Es el activo real de AMPARGO. Definir estrategia de recorte y punto focal por tipo de proyecto, añadir `blurDataURL` para eliminar el salto de carga, y documentar tipo de proyecto y contexto por imagen.
17. **Jerarquía del home.** Auditar el recorrido completo: qué ve primero el visitante, cuánto tarda en entender qué hace AMPARGO, y cuántos desplazamientos hay hasta la primera llamada a la acción.

### Fase 4 — Conversión y confianza

*Depende de material que el cliente aún debe aportar. Cada punto de `docs/client-confirmed-information.md` que se cierre habilita una sección.*

18. Testimonios reales autorizados (mínimo tres, con permiso de publicación).
19. Pares Antes/Después auténticos del mismo espacio desde ángulo similar.
20. Redacción aprobada de garantía, seguro y licencias — hoy prohibidas en copy público, y son exactamente las señales que un propietario busca antes de dejar entrar a alguien en su casa.
21. FAQ, ya redactada en notas internas y a la espera de aprobación.
22. Términos del presupuesto inicial gratuito, una vez definido qué cuenta como revisión.

**Ninguno de estos puntos se construye con contenido inventado a la espera de sustituirlo.** Ese contenido llega a producción.

## Cómo trabajar esto

El repositorio trae ahora tres skills en `.claude/skills/`, que Claude Code carga solo cuando la tarea las toca:

| Skill | Cubre |
| --- | --- |
| `ampargo-frontend` | Componentes, tokens, sistema de animación `data-reveal`, accesibilidad, imágenes, i18n en la UI |
| `ampargo-backend` | Ruta de presupuesto, validación compartida, adaptador de entrega, CSP, variables de entorno, SEO técnico |
| `ampargo-content` | Copy bilingüe, voz de marca, y qué se puede y no se puede publicar según lo confirmado por el cliente |

El prompt de arranque de cada sesión está en [`docs/master-prompt.md`](master-prompt.md), con variantes por tipo de tarea.

### Primeros pasos en casa

```bash
git clone <repo> && cd EMPRESA-AMPARGO-
npm install
git checkout claude/repository-analysis-pwvsh0
claude
```

Las skills se detectan solas al estar en `.claude/skills/`. Comprueba con `/context` que aparecen. Luego pega el prompt maestro y empieza por la Fase 1.

### Decisiones que conviene pedir al cliente ya

Bloquean las fases 3 y 4 y tienen plazo de respuesta largo:

- Dominio definitivo y correo corporativo.
- Logo en vectorial o alta resolución.
- Términos exactos de garantía, seguro y licencias, con redacción autorizada.
- Tres testimonios con permiso de publicación.
- Pares Antes/Después del mismo espacio.
