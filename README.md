# Intel-crawler

Web scraper para extraer la informacion de procesadores del sitio intel

## Requerimientos

- Nodejs
- MongoDB

## Ejecucion

- Configurar la conexion de mongoDB en lib/db.js
- `node crawl.js` para ejecutar el scraper
- `node parse.js` para parsear el resultado del scraper

## Importante

Para poder empezar la ejecucion es necesarion configurar la url semilla por donde empezara. En la base de datos debe existir una coleccion llamada seeds con el siguente documento:

```
{
  "url": "https://www.intel.com/content/www/us/en/products/processors.html",
  "status": "Active"  
}
```