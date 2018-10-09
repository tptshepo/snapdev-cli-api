const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Package } = require('./../models/package.model');

const packages = [
  {
    _id: new ObjectID('5bb9fdfb03fa1d5f278e516f'),
    name: 'Android',
    tags: ['mobile', 'android'],
    schemaModel: '{ package: "com.qualip.myapp" }'
  },
  {
    _id: new ObjectID('5bba10df1a7ac7627cb94fcd'),
    name: 'Nodejs',
    tags: ['api', 'nodejs'],
    schemaModel: '{ project: "cli-app" }'
  }
];

beforeEach(done => {
  Package.deleteMany({})
    .then(() => {
      return Package.insertMany(packages);
    })
    .then(() => done());
});

describe('POST /api/packages', () => {
  it('should create a new package', done => {
    var doc = {
      name: 'iOS',
      tags: ['mobile', 'ios'],
      schemaModel: '{ project: "com.qualip.ios" }'
    };

    request(app)
      .post('/api/packages')
      .send(doc)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('iOS');
      })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        Package.find({ name: doc.name })
          .then(packages => {
            expect(packages.length).toBe(1);
            expect(packages[0].name).toBe(doc.name);
            expect(packages[0].tags[0]).toBe(doc.tags[0]);
            expect(packages[0].tags[1]).toBe(doc.tags[1]);
            expect(packages[0].schemaModel).toBe(doc.schemaModel);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create package with invalid body data', done => {
    request(app)
      .post('/api/packages')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Package.find()
          .then(packages => {
            expect(packages.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /api/packages', () => {
  it('should get all packages', done => {
    request(app)
      .get('/api/packages')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /api/packages/:id', () => {
  it('should return package doc', done => {
    request(app)
      .get(`/api/packages/${packages[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(packages[0].name);
      })
      .end(done);
  });

  it('should return 404 if package not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/api/packages/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/api/packages/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /api/packages/:id', () => {
  it('should remove a package', done => {
    var hexId = packages[1]._id.toHexString();
    request(app)
      .delete(`/api/packages/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Package.findById(hexId)
          .then(doc => {
            expect(doc).toBeFalsy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if package not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/api/packages/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/api/packages/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /api/packages/:id', () => {
  it('should update the package', done => {
    const hexId = packages[0]._id.toHexString();
    const name = 'This should be the new name';
    const schemaModel = 'new schema model';
    const tags = ['1', '2'];

    request(app)
      .patch(`/api/packages/${hexId}`)
      .send({
        name,
        schemaModel,
        tags
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(name);
        expect(res.body.schemaModel).toBe(schemaModel);
        expect(res.body.tags[0]).toBe(tags[0]);
        expect(res.body.tags[1]).toBe(tags[1]);
      })
      .end(done);
  });
});
