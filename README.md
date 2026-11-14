# Faldeos La Lajuela · Propuesta «Bosque Vivo»

Landing page de una sola página (HTML5 + CSS3 + JavaScript vanilla, Vite solo como herramienta de desarrollo, animaciones con Anime.js).

Naturalista e inmersivo. Fotografía a sangre completa, secciones con bordes curvos que fluyen una sobre otra, formas orgánicas, carriles de galería con scroll horizontal. Tipografía: Outfit (sans geométrica grande). Animaciones presentes: parallax, formas que respiran, botones imantados.

## Ejecutar

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # genera /dist
npm run preview  # previsualiza el build
```

## Cambiar el número de WhatsApp

Abre `src/main.js` y edita **una sola constante** al inicio del archivo:

```js
const WHATSAPP_NUMBER = "56900000000"; // [COMPLETAR]
```

Formato internacional, solo dígitos (ej. `56912345678`). Se usa en el formulario y en el botón de WhatsApp del footer.

## Reemplazar imágenes

Los archivos de `assets/*.svg` son placeholders con proporción definida. Sube la foto real a `assets/` y cambia el `src` en `index.html`
(mantén `width`/`height` con la proporción real y actualiza el `alt`). Para un video de fondo en el hero, reemplaza la etiqueta `<img class="bleed">` o la foto del hero por un `<video autoplay muted loop playsinline>`.

## Reemplazar textos [COMPLETAR]

Busca `[COMPLETAR]`, `[TESTIMONIO DE EJEMPLO]` y `[NOMBRE DE HUÉSPED]` en `index.html`. Pendientes: dirección y referencias, capacidad/equipamiento de las cabañas, condiciones de servicios, testimonios reales, historia, datos legales. También confirma el nombre del negocio, tomado del usuario de Instagram `@faldeos.lalajuela`.

## Quitar la sección «Historia» (opcional)

Elimina la `<section id="historia">` y los enlaces `#historia` del menú y del footer.

## Paleta

#0c3526 verde profundo · #14583f bosque · #cfeec6 hoja · #f4f6ec blanco roto · #ffb21a amarillo · #ff6a1f naranja
