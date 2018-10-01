const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  googleID:{
    type:String,
    required: true
  },
  email:{
    type:String,
    required:true
  },
  firstName:{
    type:String
  },
  lastName:{
    type:String
  },
  imaga:{
    type:String
  }
});

mongoose.model('users', UserSchema);
