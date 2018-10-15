const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs  = require('express-handlebars');

//Load User model
require('./models/User');
require('./models/Story');

//Passport config
require('./config/passport')(passport);

//Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//Load Keys
const keys = require('./config/keys');

//Handlebars helpers
const {
  truncate, 
  stripTags
} = require('./helpers/hbs');

//Map global Promises
mongoose.Promise = global.Promise;

//Mongoose connect 
mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({
  helpers: {
    truncate: truncate,
    stripTags: stripTags
  },
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


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

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Set global vars
app.use((req, res, next) => {
  res.locals.user = req.user || null;
    next();
})

//Use Routes
app.use('/stories', stories)
app.use('/auth', auth);
app.use('/', index);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server start on port ${port}`);
})