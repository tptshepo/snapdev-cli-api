const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Project } = require('../models/project.model');

const projects = [
  {
    _id: new ObjectID(),
    name: 'Chatbot'
  },
  {
    _id: new ObjectID(),
    name: 'Nodejs'
  }
];

beforeEach(done => {
  Project.deleteMany({})
    .then(() => {
      return Project.insertMany(projects);
    })
    .then(() => done());
});

describe('POST /api/projects', () => {
  it('should create a new project', done => {
    var doc = {
      name: 'iOS'
    };

    request(app)
      .post('/api/projects')
      .send(doc)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe('iOS');
      })
      .end((e, res) => {
        if (e) {
          return done(e);
        }
        Project.find({ name: doc.name })
          .then(projects => {
            expect(projects.length).toBe(1);
            expect(projects[0].name).toBe(doc.name);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should not create project with invalid body data', done => {
    request(app)
      .post('/api/projects')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Project.find()
          .then(projects => {
            expect(projects.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /api/projects', () => {
  it('should get all projects', done => {
    request(app)
      .get('/api/projects')
      .expect(200)
      .expect(res => {
        expect(res.body.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /api/projects/:id', () => {
  it('should return project doc', done => {
    request(app)
      .get(`/api/projects/${projects[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(projects[0].name);
      })
      .end(done);
  });

  it('should return 404 if project not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/api/projects/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', done => {
    request(app)
      .get('/api/projects/123abc')
      .expect(404)
      .end(done);
  });
});

describe('DELETE /api/projects/:id', () => {
  it('should remove a project', done => {
    var hexId = projects[1]._id.toHexString();
    request(app)
      .delete(`/api/projects/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Project.findById(hexId)
          .then(doc => {
            expect(doc).toBeFalsy();
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return 404 if project not found', done => {
    var hexId = new ObjectID().toHexString();
    request(app)
      .delete(`/api/projects/${hexId}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', done => {
    request(app)
      .delete('/api/projects/123abc')
      .expect(404)
      .end(done);
  });
});

describe('PATCH /api/projects/:id', () => {
  it('should update the project', done => {
    const hexId = projects[0]._id.toHexString();
    const name = 'This should be the new name';

    request(app)
      .patch(`/api/projects/${hexId}`)
      .send({
        name
      })
      .expect(200)
      .expect(res => {
        expect(res.body.name).toBe(name);
      })
      .end(done);
  });
});
