const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { ProjectPackage } = require('../models/projectPackage.model');

const projectPackages = [
  {
    _id: new ObjectID(),
    packageId: new ObjectID(),
    dataModel: 'model data 1'
  },
  {
    _id: new ObjectID(),
    packageId: new ObjectID(),
    dataModel: 'model data 2'
  }
];

beforeEach(done => {
  ProjectPackage.deleteMany({})
    .then(() => {
      return ProjectPackage.insertMany(projectPackages);
    })
    .then(() => done());
});

describe('POST /api/projectPackages', () => {
  it('should create a new projectPackage', done => {
    var doc = {
      packageId: '5bbce185d587b680e7ca44b8',
      dataModel: 'new data model'
    };

    request(app)
      .post('/api/projectPackages')
      .send(doc)
      .expect(200)
      .expect(res => {
        expect(res.body.dataModel).toBe(doc.dataModel);
      })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        ProjectPackage.find({ dataModel: doc.dataModel })
          .then(projectPackages => {
            expect(projectPackages.length).toBe(1);
            expect(projectPackages[0].dataModel).toBe(doc.dataModel);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create projectPackage with invalid body data', done => {
    request(app)
      .post('/api/projectPackages')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ProjectPackage.find()
          .then(projectPackages => {
            expect(projectPackages.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /api/projectPackages', () => {
  it('should get all projectPackages', done => {
    request(app)
      .get('/api/projectPackages')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /api/projectPackages/:id', () => {
  it('should return projectPackage doc', done => {
    request(app)
      .get(`/api/projectPackages/${projectPackages[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.dataModel).toBe(projectPackages[0].dataModel);
      })
      .end(done);
  });

  it('should return 404 if projectPackage not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/api/projectPackages/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/api/projectPackages/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /api/projectPackages/:id', () => {
  it('should remove a projectPackage', done => {
    var hexId = projectPackages[1]._id.toHexString();
    request(app)
      .delete(`/api/projectPackages/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        ProjectPackage.findById(hexId)
          .then(doc => {
            expect(doc).toBeFalsy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if projectPackage not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/api/projectPackages/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/api/projectPackages/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /api/projectPackages/:id', () => {
  it('should update the projectPackage', done => {
    const hexId = projectPackages[0]._id.toHexString();
    const packageId = new ObjectID().toHexString();
    const dataModel = 'This should be the new data model';

    request(app)
      .patch(`/api/projectPackages/${hexId}`)
      .send({
        packageId,
        dataModel
      })
      .expect(200)
      .expect(res => {
        expect(res.body.dataModel).toBe(dataModel);
      })
      .end(done);
  });
});
