const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//Passport config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');

//Load Keys
const keys = require('./config/keys');

//Map global Promises
mongoose.Promise = global.Promise;

//Mongoose connect 
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

app.get('/', (req, res) => {
  res.send('It works...');
})

//Use Routes
app.use('/auth', auth)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
})