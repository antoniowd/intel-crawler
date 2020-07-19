const jsdom = require('jsdom');
const Crawler = require('crawler');
const md5 = require('md5');
const URL = require('url');
const fs = require('fs');
const db = require('../lib/db');
const cache = require('../lib/cache');

exports.run = () => {

  return new Promise(async (reject, resolve) => {
    site = 'intel';

    const crawler = new Crawler({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      jQuery: jsdom,
      maxConnections: 1,
      rateLimit: 10000,
      timeout: 120000,
      callback: async (err, res, done) => {
        if (err) {
          console.log(err.message);
        } else {
          const requestUrl = res.request.uri.href;
          const dom = new jsdom.JSDOM(res.body);
          const { document } = dom.window;

          console.log(requestUrl);

          // Check if the page has pagination
          const pagingInfo = document.querySelector('.paging-info span.page-total');
          if (pagingInfo !== null && requestUrl.search(/\?page\=/gi) === -1) {
            for (let i = 2; i < parseInt(pagingInfo.textContent) + 1; i++) {
              const url = URL.resolve(requestUrl, `${requestUrl}?page=${i}`);
              if (!fs.existsSync(`./temp/${md5(url)}`)) {
                fs.writeFileSync(`./temp/${md5(url)}`, url);
                const queue = {
                  uri: url,
                };
                crawler.queue(queue);
                cache.save(queue, site)
              }
            }
          }
          
          // Find all url for processors
          (document.querySelectorAll('a[href^="/content/www/us/en/products/processors/"]') || [])
          .forEach((item) => {
            const url = URL.resolve(requestUrl, item.href);
            if (!fs.existsSync(`./temp/${md5(url)}`)) {
              fs.writeFileSync(`./temp/${md5(url)}`, url);
                const queue = {
                  uri: url,
                };
                crawler.queue(queue);
                cache.save(queue, site)
              } 
            });

          // Save the page of Technical specifications
          if (document.querySelector('section.product-comp') !== null) {
            await db.insert('downloaded', {
              url: requestUrl,
              type: 'processor',
              site: 'intel',
              rawData: res.body,
              status: 'downloaded',
            });
          }

          await cache.deleteUri(requestUrl, site);
        }


        done();
      }
    });

    const seeds = await cache.getSeeds(site);
    console.log(seeds);
    crawler.queue(seeds);

    crawler.on('drain', () => {
      resolve(true);
    });
  });
}