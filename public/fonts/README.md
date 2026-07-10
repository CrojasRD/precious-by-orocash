# Fuente de marca: Exmouth

La tipografía "Exmouth" usada en los titulares (logotipo, `font-serif` en Tailwind) no está disponible en Google Fonts, así que el proyecto la autoaloja mediante `@font-face` en `app/globals.css`. Por eso no viene incluida en este repositorio: hay que agregar los archivos manualmente.

## De dónde obtenerla

Exmouth es una fuente script/caligráfica publicada por **PrimaFont**, distribuida como gratuita para uso personal y comercial (revisa siempre el archivo léeme/licencia del paquete que descargues, ya que las condiciones exactas dependen del sitio de distribución):

- https://www.dafont.com/exmouth.font
- https://www.1001freefonts.com/exmouth.font
- https://www.cufonfonts.com/font/exmouth

## Cómo instalarla en el proyecto

1. Descarga el archivo (normalmente `.ttf` u `.otf`).
2. Conviértelo a `.woff2` (mejor rendimiento web) con una herramienta como https://cloudconvert.com/ttf-to-woff2 o `npx fonttools`.
3. Coloca los archivos aquí, en `public/fonts/`, con estos nombres exactos:
   - `Exmouth-Regular.woff2`
   - `Exmouth-Regular.otf` (respaldo para navegadores sin soporte woff2)
4. Listo — `app/globals.css` ya referencia estas rutas mediante `@font-face`. Mientras no agregues los archivos, el sitio usa automáticamente el respaldo `Playfair Display` / `Georgia` sin romperse.

## Si quieres variantes bold/italic

Exmouth se distribuye típicamente solo en un estilo. Si consigues variantes adicionales, agrega un bloque `@font-face` más en `app/globals.css` por cada peso/estilo (con su propio `font-weight`/`font-style`), usando el mismo `font-family: "Exmouth"`.
