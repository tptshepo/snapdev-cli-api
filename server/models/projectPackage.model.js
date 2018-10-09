const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const ProjectPackageSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, required: true },
  packageId: { type: Schema.Types.ObjectId, required: true },
  dataModel: { type: String, required: true, minLength: 1, trim: true }
});

const ProjectPackage = mongoose.model('ProjectPackage', ProjectPackageSchema);

module.exports = { ProjectPackage };
