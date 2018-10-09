const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  name: { type: String, required: true, minLength: 1, trim: true }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = { Project };
