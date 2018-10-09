const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { ProjectPackage } = require('../models/projectPackage.model');

router.post('/', (req, res, next) => {
  const projectPackageModel = new ProjectPackage({
    packageId: req.body.packageId,
    dataModel: req.body.dataModel
  });

  projectPackageModel.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/', (req, res, next) => {
  ProjectPackage.find().then(
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

  ProjectPackage.findById(id)
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

  ProjectPackage.findByIdAndDelete(id)
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
  var body = _.pick(req.body, ['dataModel']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  ProjectPackage.findByIdAndUpdate(id, { $set: body }, { new: true })
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
