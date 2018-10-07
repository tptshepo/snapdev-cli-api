const _ = require('lodash');
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Template } = require('../models/template.model');
const { Package } = require('./../models/package.model');

const packages = [
  {
    _id: new ObjectID('5bb9fdfb03fa1d5f278e516f'),
    name: 'Android',
    tags: ['mobile', 'android'],
    schemaModel: '{ name: "android-app" }',
    templates: []
  },
  {
    _id: new ObjectID('5bba10df1a7ac7627cb94fcd'),
    name: 'Nodejs',
    tags: ['api', 'nodejs'],
    schemaModel: '{ name: "node-app" }',
    templates: []
  }
];

const templates = [
  {
    _id: new ObjectID(),
    package: new ObjectID('5bba10df1a7ac7627cb94fcd'),
    sourceFileName: 'controller.js',
    destFileName: 'controller.js',
    path: '/',
    fileContent: 'this is a controller file'
  },
  {
    _id: new ObjectID(),
    package: new ObjectID('5bba10df1a7ac7627cb94fcd'),
    sourceFileName: 'model.js',
    destFileName: 'model.js',
    path: '/',
    fileContent: 'this is a model file'
  }
];

beforeEach(done => {
  Package.deleteMany({})
    .then(() => {
      return Package.insertMany(packages);
    })
    .then(() => {
      return Template.deleteMany({})
        .then(() => {
          return Template.insertMany(templates);
        })
        .then(templateDocs => {
          // console.log('templates****', templateDocs);
          // find package for templates
          return Package.findById('5bba10df1a7ac7627cb94fcd')
            .then(packageDoc => {
              // add template ID's to package
              // console.log('packages****', packageDoc);
              templateDocs.forEach(template => {
                packageDoc.templates.push(
                  new ObjectID(template._id.toHexString())
                );
              });

              // patch package with templates
              var body = _.pick(packageDoc, ['templates']);
              return Package.findByIdAndUpdate(
                '5bba10df1a7ac7627cb94fcd',
                { $set: body },
                { new: true }
              );
            })
            .then(() => done());
        });
    });
});

describe('POST /api/templates', () => {
  it('should create a new template', done => {
    const packageHexId = packages[0]._id.toHexString();

    var doc = {
      package: packageHexId,
      sourceFileName: 'route.js',
      destFileName: 'route.js',
      path: '/',
      fileContent: 'this is a route file'
    };

    request(app)
      .post('/api/templates')
      .send(doc)
      .expect(200)
      .expect(res => {
        // console.log('res.body****', res.body);
        expect(res.body.sourceFileName).toBe(doc.sourceFileName);
        expect(res.body.destFileName).toBe(doc.destFileName);
        expect(res.body.path).toBe(doc.path);
        expect(res.body.fileContent).toBe(doc.fileContent);
      })
      .end((e, res) => {
        // console.log('res.body****', res.body);
        if (e) {
          return done(e);
        }

        Template.findById(res.body._id)
          .then(template => {
            // console.log('template****', template);
            expect(template.sourceFileName).toBe(doc.sourceFileName);
            expect(template.destFileName).toBe(doc.destFileName);
            expect(template.path).toBe(doc.path);
            expect(template.fileContent).toBe(doc.fileContent);
            done();
          })
          .catch(e => done(e));
      });
  });

  // it('should not create template with invalid body data', done => {
  //   request(app)
  //     .post('/api/templates')
  //     .send({})
  //     .expect(400)
  //     .end((err, res) => {
  //       if (err) {
  //         return done(err);
  //       }

  //       Template.find()
  //         .then(templates => {
  //           expect(templates.length).toBe(2);
  //           done();
  //         })
  //         .catch(e => done(e));
  //     });
  // });
});

// describe('GET /api/templates', () => {
//   it('should get all templates', done => {
//     request(app)
//       .get('/api/templates')
//       .expect(200)
//       .expect(res => {
//         expect(res.body.length).toBe(2);
//       })
//       .end(done);
//   });
// });

// describe('GET /api/templates/:id', () => {
//   it('should return template doc', done => {
//     request(app)
//       .get(`/api/templates/${templates[0]._id.toHexString()}`)
//       .expect(200)
//       .expect(res => {
//         expect(res.body.name).toBe(templates[0].name);
//       })
//       .end(done);
//   });

//   it('should return 404 if template not found', done => {
//     var hexId = new ObjectID().toHexString();
//     request(app)
//       .get(`/api/templates/${hexId}`)
//       .expect(404)
//       .end(done);
//   });

//   it('should return 404 for non-object ids', done => {
//     request(app)
//       .get('/api/templates/123abc')
//       .expect(404)
//       .end(done);
//   });
// });

// describe('DELETE /api/templates/:id', () => {
//   it('should remove a template', done => {
//     var hexId = templates[1]._id.toHexString();
//     request(app)
//       .delete(`/api/templates/${hexId}`)
//       .expect(200)
//       .expect(res => {
//         expect(res.body._id).toBe(hexId);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Template.findById(hexId)
//           .then(doc => {
//             expect(doc).toBeFalsy();
//             done();
//           })
//           .catch(e => done(e));
//       });
//   });

//   it('should return 404 if template not found', done => {
//     var hexId = new ObjectID().toHexString();
//     request(app)
//       .delete(`/api/templates/${hexId}`)
//       .expect(404)
//       .end(done);
//   });

//   it('should return 404 if object id is invalid', done => {
//     request(app)
//       .delete('/api/templates/123abc')
//       .expect(404)
//       .end(done);
//   });
// });

// describe('PATCH /api/templates/:id', () => {
//   it('should update the template', done => {
//     const hexId = templates[0]._id.toHexString();
//     const name = 'This should be the new name';
//     const schemaModel = 'new schema model';
//     const tags = ['1', '2'];
//     const objID = new ObjectID();
//     const templates = [objID];

//     request(app)
//       .patch(`/api/templates/${hexId}`)
//       .send({
//         name,
//         schemaModel,
//         tags,
//         templates
//       })
//       .expect(200)
//       .expect(res => {
//         expect(res.body.name).toBe(name);
//         expect(res.body.schemaModel).toBe(schemaModel);
//         expect(res.body.tags[0]).toBe(tags[0]);
//         expect(res.body.tags[1]).toBe(tags[1]);
//         expect(res.body.templates[0]).toBe(objID.toHexString());
//       })
//       .end(done);
//   });
// });
