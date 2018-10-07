const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  sourceFileName: String,
  destFileName: String,
  path: String,
  fileContent: String
});

const Template = mongoose.model('Template', TemplateSchema);

module.exports = { Template };
