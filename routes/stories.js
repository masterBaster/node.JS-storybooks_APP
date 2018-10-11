const express = require('express');
const router = express.Router();
const moongose = require('mongoose');
const Story = moongose.model('stories');
const User = moongose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


router.get('/', (req, res) => {
  Story.find({status:'public'})
  .populate('user')
  .then(stories => {
    res.render('stories/index', {
      stories: stories
    });
  });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('stories/add');
});

//Process and story

router.post('/', (req, res) => {
  let allowComments;

  if(req.body.allowComments){
    allowComments = true;
  }else{
    allowComments = false;
  }

  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.body.id
  }

  //create story
  new Story(newStory)
    .save()
    .then(story => {
      res.redirect(`/stories/show/${story.id}`)
    })
});

router.get('/edit', (req, res) => {
  res.render('stories/edit');
});

router.get('/show', (req, res) => {
  res.render('stories/show');
});


module.exports = router;