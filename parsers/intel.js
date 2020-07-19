const jsdom = require('jsdom');
const db = require('../lib/db');
const { asyncForEach } = require('../helpers/utils');

exports.run = () => {
  return new Promise(async (resolve, reject) => {
    const items = await db.find('downloaded', { status: { $ne: 'parsed' } }, { projection: { _id: 1 } });

    await asyncForEach(items, async (item, i) => {
      const downloaded = await db.findOne('downloaded', { _id: db.types.ObjectId(item._id) });
      const dom = new jsdom.JSDOM(downloaded.rawData);
      const { document } = dom.window;
      
      const name = document.querySelector('.product-info .headline-font').textContent;
      const family = document.querySelector('#breadcrumbId > li:nth-child(2) > a > span').textContent;
      
      console.log(downloaded.url);
      console.log(family);
      console.log(name);
      const data = [];
      document.querySelectorAll('.mobileRow').forEach((row) => {
        const key = row.querySelector('div.tech-label') !== null
          ? row.querySelector('div.tech-label').textContent.trim()
          : null;

        const value = row.querySelector('div:nth-child(2)') !== null
          ? row.querySelector('div:nth-child(2)').textContent.trim()
          : null;

        if (key !== null && value !== null) {
          console.log(`${key}: ${value}`);
          data.push({
            key,
            value,
          });
        }
      });

      await db.insert('parsed', {
        url: downloaded.url,
        type: downloaded.type,
        brand: 'intel',
        family,
        name,
        data,
      });

      console.log('------------------------------------');
    });

    return resolve();
  });
}