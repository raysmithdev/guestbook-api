const express = require('express');
const bodyParser = require('body-parser');
const controller = require('./event.controller');
const passport = require('passport');
const router = express.Router();

router.use(bodyParser.json());

// GET ALL EVENTS FROM USER 
router.get(
  '/',
  //passport.authenticate('jwt, { session: false }),
  controller.findExistingEvents
);

// GET ALL ACTIVE EVENTS FROM USER
router.get(
  '/active',
  //passport.authenticate('jwt, { session: false }),
  controller.findActiveEvents
);

// GET ALL PAST EVENTS FROM USER
router.get(
  '/past',
  //passport.authenticate('jwt, { session: false }),
  controller.findPastEvents
)

// GET ALL ARCHIVED EVENTS FROM USER
router.get(
  '/arhived',
    //passport.authenticate('jwt, { session: false }),
  controller.findArchivedEvents
)

module.exports = router; 