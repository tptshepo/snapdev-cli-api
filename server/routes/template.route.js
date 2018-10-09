const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { Template } = require('../models/template.model');

router.post('/', (req, res, next) => {
  // console.log('req.body', req.body);
  if (!ObjectID.isValid(req.body.packageId)) {
    return res.status(400).send();
  }

  const templateModel = new Template({
    packageId: new ObjectID(req.body.packageId),
    sourceFileName: req.body.sourceFileName || '',
    destFileName: req.body.destFileName || '',
    path: req.body.path || '/',
    fileContent: req.body.fileContent || ''
  });

  templateModel.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/', (req, res, next) => {
  Template.find().then(
    docs => {
      res.send(docs);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Template.findById(id)
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send(doc);
    })
    .catch(e => {
      res.status(400).send();
    });
});

router.delete('/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Template.findByIdAndDelete(id)
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send(doc);
    })
    .catch(e => {
      res.status(400).send();
    });
});

router.patch('/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, [
    'sourceFileName',
    'destFileName',
    'path',
    'fileContent'
  ]);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Template.findByIdAndUpdate(id, { $set: body }, { new: true })
    .then(doc => {
      if (!doc) {
        return res.status(404).send();
      }
      res.send(doc);
    })
    .catch(e => {
      res.status(400).send();
    });
});

module.exports = router;
