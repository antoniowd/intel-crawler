const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

exports.connect = () => new Promise((resolve, reject) => {

  const options = {
    useUnifiedTopology: true,
  }
  if (_db === undefined) {
    MongoClient.connect('mongodb://10.1.1.103:27017', options, (err, client) => {
      if (err) {
        return reject(err);
      }

      _db = client.db('acit_piit');
      return resolve(true);
    });
  } else {
    return reject(new Error('You are already connected'));
  }
});

exports.getDb = () => db;

exports.types = {
  ObjectId: mongodb.ObjectId,
}

exports.findOne = (collection, query = {}, options = {}) => new Promise((resolve, reject) => {
  if (_db === undefined) {
    return reject(new Error('You must establish a connection with mongodb'));
  }

  const _collection = _db.collection(collection);
  _collection.findOne(query, options, (err, document) => {
    if (err) {
      return reject(err);
    }

    return resolve(document);
  });
});

exports.find = (collection, query = {}, options = {}) => new Promise((resolve, reject) => {
  if (_db === undefined) {
    return reject(new Error('You must establish a connection with mongodb'));
  }

  const _collection = _db.collection(collection);
  _collection.find(query, options).toArray((err, document) => {
    if (err) {
      return reject(err);
    }

    return resolve(document);
  });
});

exports.insert = (collection, document) => new Promise((resolve, reject) => {
  if (_db === undefined) {
    return reject(new Error('You must establish a connection with mongodb'));
  }

  const _collection = _db.collection(collection);
  _collection.insertOne(document, (err, result) => {
    if (err) {
      return reject(err);
    }

    return resolve(result);
  });
});

exports.update = (collection, query, document) => new Promise((resolve, reject) => {
  if (_db === undefined) {
    return reject(new Error('You must establish a connection with mongodb'));
  }

  const _collection = _db.collection(collection);
  _collection.updateOne(query, document, (err, result) => {
    if (err) {
      return reject(err);
    }

    return resolve(result);
  });
});

exports.findOneAndUpdate = (collection, query, document, options = {}) => new Promise((resolve, reject) => {

  if (_db === undefined) {
    return reject(new Error('You must establish a connection with mongodb'));
  }

  const _collection = _db.collection(collection);
  _collection.findOneAndUpdate(query, document, options, (err, result) => {
    if (err) {
      return reject(err);
    }

    return resolve(result);
  });
});

