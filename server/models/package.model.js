const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const PackageSchema = new Schema({
  name: { type: String, required: true, minLength: 1, trim: true },
  tags: [{ type: String, required: true }],
  schemaModel: { type: String, required: true }
});

const Package = mongoose.model('Package', PackageSchema);

module.exports = { Package };
