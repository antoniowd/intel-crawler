const db = require('./lib/db');
const intelCrawler = require('./crawlers/intel');

// En la tabla seeds debe tener un documento especificando el seed
/*
{
  "url": "https://www.intel.com/content/www/us/en/products/processors.html",
  "status": "Active"  
}
*/

db.connect().then(() => {
  intelCrawler.run().then(() => console.log('Done'));
})
  .catch((err) => console.log(err));