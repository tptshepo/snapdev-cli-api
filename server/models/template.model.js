const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  packageId: { type: Schema.Types.ObjectId, required: true },
  sourceFileName: { type: String, required: true },
  destFileName: { type: String, required: true },
  path: { type: String, required: true },
  fileContent: { type: String, required: true }
});

const Template = mongoose.model('Template', TemplateSchema);

module.exports = { Template };
