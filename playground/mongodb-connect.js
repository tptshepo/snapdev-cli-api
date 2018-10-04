const MongoClient = require('mongodb').MongoClient;
// Connection url
const url = 'mongodb://localhost:27017';
const dbName = 'SnapDev';

// Connect using MongoClient
MongoClient.connect(
  url,
  (err, client) => {
    if (err) {
      return console.log('Unable to connect to mongodb.');
    }
    console.log('Connected to mongodb');

    const db = client.db(dbName);

    db.collection('packages').insertOne(
      {
        name: 'CSharp',
        tags: ['.net', 'core']
      },
      (err, result) => {
        if (err) {
          return console.log('Error inserting a package', err);
        }
        console.log(
          JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2)
        );
      }
    );

    client.close();
  }
);
