const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');
const { Project } = require('../models/project.model');
const { ProjectPackage } = require('../models/projectPackage.model');

/**
 * Projects
 *
 * POST /api/projects
 * GET /api/projects
 * DELETE /api/projects/:id
 * PATCH /api/projects/:id
 *
 * ProjectPackages
 *
 * POST /api/projects/:id/packages
 * GET /api/projects/:id/packages
 * DELETE /api/projects/packages/:id
 * PATCH /api/projects/packages/:id
 *
 */

router.post('/', (req, res, next) => {
  const projectModel = new Project({
    name: req.body.name
  });

  projectModel.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/', (req, res, next) => {
  Project.find().then(
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

  Project.findById(id)
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

  Project.findByIdAndDelete(id)
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
  var body = _.pick(req.body, ['name']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Project.findByIdAndUpdate(id, { $set: body }, { new: true })
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

/**
 * ProjectPackage
 */

router.post('/:id/packages', (req, res, next) => {
  var id = req.params.id;
  const projectPackageModel = new ProjectPackage({
    projectId: id,
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

router.get('/:id/packages', (req, res, next) => {
  var id = req.params.id;
  ProjectPackage.find({ projectId: new ObjectID(id) }).then(
    docs => {
      res.send(docs);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

router.get('/:id/packages/:pid', (req, res) => {
  var id = req.params.id;
  var pid = req.params.pid;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  if (!ObjectID.isValid(pid)) {
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
