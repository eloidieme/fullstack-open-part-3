/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /[0-9]+-[0-9]+/i.test(v),
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

entrySchema.set('toJSON', {
  transform: (document, returnedEntry) => {
    returnedEntry.id = returnedEntry._id.toString();
    delete returnedEntry._id;
    delete returnedEntry.__v;
  },
});

module.exports = mongoose.model('Entry', entrySchema);
