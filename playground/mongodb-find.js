const { MongoClient, ObjectID } = require('mongodb');
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

    db.collection('Packages')
      .find({
        // name: 'Android'
        _id: new ObjectID('5bb634561933cd2944b29fee')
      })
      .toArray()
      .then(
        docs => {
          console.log(JSON.stringify(docs, undefined, 2));
        },
        err => {
          if (err) {
            console.log('Error finding document');
          }
        }
      );

    // db.collection('Packages')
    //   .find()
    //   .count()
    //   .then(
    //     count => {
    //       console.log(`Total count: ${count}`);
    //     },
    //     err => {
    //       if (err) {
    //         console.log('Error finding document');
    //       }
    //     }
    //   );

    // client.close();
  }
);
