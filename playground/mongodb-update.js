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

    // findOneAndUpdate

    db.collection('Packages')
      .findOneAndUpdate(
        {
          // name: 'Android'
          _id: new ObjectID('5bb634561933cd2944b29fee')
        },
        {
          $set: {
            name: 'iOS'
          }
        },
        {
          returnOriginal: false // return updated document
        }
      )
      .then(
        result => {
          console.log(result);
        },
        err => {
          if (err) {
            console.log('Error updating document');
          }
        }
      );
  }
);
