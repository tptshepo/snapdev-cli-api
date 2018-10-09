const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const ProjectPackageSchema = new Schema({
  dataModel: { type: String, required: true, minLength: 1, trim: true },
  packageId: { type: Schema.Types.ObjectId, required: true }
});

const ProjectPackage = mongoose.model('ProjectPackage', ProjectPackageSchema);

module.exports = { ProjectPackage };
