# Intel-crawler

Web scraper para extraer la informacion de procesadores del sitio intel

## Requerimientos

- Nodejs
- MongoDB

## Ejecucion

- Configurar la conexion de mongoDB en lib/db.js
- `node crawl.js` para ejecutar el scraper
- `node parse.js` para parsear el resultado del scraper