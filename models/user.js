const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = {
  email: {
    type: String,
    required: true,
    unique: true,
  },
};

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
