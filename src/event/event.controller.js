const { Event } = require('./event.model');
const { Guest } = require('./guest.model');
const { eventStatus, guestStatus } = require('./status.enum');

// find by user id 
const userId = req.params.userId;

// GET ALL EXISTING EVENTS 
const findExistingEvents = (req, res) => {
  Event.find({ userId: userId })
    .then(events => {
      res.json({
        events: events.map(events => events.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
};

// GET ALL ACTIVE EVENTS 
const findActiveEvents = (req, res) => {
  Event.find({ userId: userId, status: 1})
    .then(events => {
      res.json({
        events: events.map(events => events.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
}

// GET ALL PAST EVENTS
const findPastEvents = (req, res) => {
  Event.find({ userId: userId, status: 2})
    .then(events => {
      res.json({
        events: events.map(events => events.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
}

// GET ALL ARCHIVED EVENTS 
const findArchivedEvents = (req, res) => {
  Event.find({ userId: userId, status: 3})
    .then(events => {
      res.json({
        events: events.map(events => events.toClient())
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: 'internal server error'
      });
    });
}

// CREATE EVENT 

// MODIFY EVENT DETAILS 
// name, date, time, location, 

// GET ALL EXISTING GUESTS 

// ADD GUESTS

// REMOVE GUESTS 

// MODIFY GUESTS 

// RSVP status - if still status of 0 or 3, 7 days prior, send reminder email
// RSVP status - if status of 1, send reminder email 2 days prior ot event 

module.exports = {
  findExistingEvents,
  findPastEvents
}