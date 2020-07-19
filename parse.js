const db = require('./lib/db');
const intelParser = require('./parsers/intel');

db.connect().then(() => {
  intelParser.run().then(() => console.log('Done'));
})
  .catch((err) => console.log(err));