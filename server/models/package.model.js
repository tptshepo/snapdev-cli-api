const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  sourceFileName: String,
  outputFileName: String,
  content: String
});

const PackageSchema = new Schema({
  name: { type: String, required: true, minLength: 1, trim: true },
  tags: [String],
  modelSchema: String,
  templates: [TemplateSchema]
});

const Package = mongoose.model('Package', PackageSchema);

module.exports = { Package };
