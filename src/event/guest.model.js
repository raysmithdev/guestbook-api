const mongoose = require('mongoose');

const guestSchema = mongoose.Schema ({
  user_id: {type: String, required: true},
  event_id: {type: String, required: true},
  firstName: {type: String, trim: true, required: true},
  lastName: {type: String, trim: true, required: true},
  email: {type: String, trim: true, required: true},
  // 0 = no response, 1 = confirmed, 2 = declined, 3 = tentative
  rsvpStatus: {type: Number,  default: 0}, 
  plusOne: {
    needed: {type: Boolean, default: false},
    number: {type: Number }, //default: 0 ?
    name: [ 
      { 
      firstName: {type: String, trim: true}, //required? 
      lastName: {type: String, trim: true}, //required?
      }
    ]
  },
  createdDate: {type: Date, required: true}, 
});

guestSchema.methods.toClient = function() {
  return {
    id: this._id,
    user_id: this.user_id,
    event_id: this.event_id,
    name: `${this.firstName} ${this.lastName}`,
    email: this.email,
    rsvpStatus: this.rsvpStatus,
    plusOne: {
      needed: this.needed,
      number: this.number, //default: 0 ?
      name: `${this.plusOne.firstName} ${this.plusOne.lastName}`
      },
    createdDate: {type: Date, required: true}, 
    }
}

guestSchema.virtual('fulllName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = { Guest };