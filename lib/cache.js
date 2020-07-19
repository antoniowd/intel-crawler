const db = require('./db');

exports.getSeeds = async (site) => {
  const seeds = [];

  try {
    const queue = await db.findOne('cache', { site });

    if (queue && queue.urls && queue.urls.length > 0) {
      queue.urls.forEach((q) => {
        seeds.push(q);
      });
    } else {
      const mySeeds = await db.find('seeds', { status: 'Active' });
      console.log(mySeeds);
      mySeeds.forEach((seed) => {
        let url = seed.url;
        seeds.push({
          uri: url,
        });

        db.update('seeds', { _id: db.types.ObjectId(seed._id) }, { $set: { status: 'Cached' } });
      });

      const item = {
        $set: {
          site,
          urls: seeds
        }
      };
      await db.findOneAndUpdate('cache', { site }, item, { upsert: true });
    }
  } catch (err) {
    return Promise.reject(err);
  }

  return Promise.resolve(seeds);
};

exports.save = (queue, site) => {
  const newUrl = {
    $push: {
      urls: queue
    }
  };

  return db.findOneAndUpdate('cache', { site }, newUrl);
};

exports.deleteUri = (uri, site) => {
  const delUrl = {
    $pull: {
      urls: { uri }
    }
  };

  return db.findOneAndUpdate('cache', { site }, delUrl);
};


exports.clean = (site) => {
  return db.findOneAndUpdate('cache', { site }, { $set: { urls: [] } });
}