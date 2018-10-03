const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Load User model
require('./models/User');

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
});

app.use(cookieParser());
//Express session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
    next();
})

//Use Routes
app.use('/auth', auth)

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
})