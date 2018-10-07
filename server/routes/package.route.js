const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { Package } = require('../models/package.model');

router.post('/', (req, res, next) => {
  const packageModel = new Package({
    name: req.body.name,
    tags: req.body.tags || [],
    schemaModel: req.body.schemaModel || '',
    templates: req.body.templates || []
  });

  packageModel.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/', (req, res, next) => {
  Package.find().then(
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

  Package.findById(id)
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

  Package.findByIdAndDelete(id)
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
  var body = _.pick(req.body, ['name', 'tags', 'schemaModel', 'templates']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Package.findByIdAndUpdate(id, { $set: body }, { new: true })
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
