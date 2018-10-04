const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/SnapDev');

const Schema = mongoose.Schema;

const TemplateSchema = new Schema({
  sourceName: String,
  outputName: String,
  content: String
});

const PackageSchema = new Schema({
  name: { type: String, required: true, minLength: 1, trim: true },
  tags: [String],
  dataSchema: String,
  templates: [TemplateSchema]
});

var Package = mongoose.model('Package', PackageSchema);

const newPackage = new Package({
  name: 'Android',
  tags: ['app', 'mobile'],
  dataSchema: '{ text: "data" }',
  templates: [
    {
      sourceName: 'Context.java',
      outputName: 'MyContext.java',
      content: 'this is source code for context'
    },
    {
      sourceName: 'Settings.java',
      outputName: 'MySettings.java',
      content: 'this is source code for settings'
    }
  ]
});

newPackage.save().then(
  doc => {
    console.log('Package save:', doc);
  },
  err => {
    console.log('Unable to save:', err);
  }
);
