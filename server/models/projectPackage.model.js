const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const ProjectPackageSchema = new Schema({
  dataModel: { type: String, required: true, minLength: 1, trim: true },
  package: Schema.Types.ObjectId
});

const ProjectPackage = mongoose.model('ProjectPackage', ProjectPackageSchema);

module.exports = { ProjectPackage };
