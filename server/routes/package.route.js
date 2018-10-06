const express = require('express');
const router = express.Router();

const { Package } = require('../models/package.model');

router.post('/', (req, res, next) => {
  const packageModel = new Package({
    name: req.body.name,
    tags: req.body.tags || [],
    modelSchema: req.body.modelSchema || '',
    templates: req.body.templates || []
  });

  packageModel.save().then(
    doc => {
      console.log('Package save:', doc);
      res.send(doc);
    },
    e => {
      console.log('Unable to save package:', e);
      res.status(400).send(e);
    }
  );
});

router.get('/', (req, res, next) => {
  Package.find().then(
    docs => {
      res.send({ docs });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

module.exports = router;
