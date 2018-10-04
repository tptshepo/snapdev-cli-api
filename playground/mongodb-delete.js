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

    // deleteMany
    // db.collection('Packages')
    //   .deleteMany({
    //     name: 'hello'
    //   })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       if (err) {
    //         console.log('Error deleting documents');
    //       }
    //     }
    //   );

    // deleteOne

    // db.collection('Packages')
    //   .deleteOne({
    //     name: 'tshepo'
    //   })
    //   .then(
    //     result => {
    //       console.log(result);
    //     },
    //     err => {
    //       if (err) {
    //         console.log('Error deleting document');
    //       }
    //     }
    //   );

    // findOneAndDelete - results returns the document that was deleted

    db.collection('Packages')
      .findOneAndDelete({
        _id: new ObjectID('5bb63c8be01a7028942647ec')
      })
      .then(
        result => {
          console.log(result);
        },
        err => {
          if (err) {
            console.log('Error deleting document');
          }
        }
      );
  }
);
