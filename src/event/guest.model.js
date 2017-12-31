const mongoose = require('mongoose');

const guestSchema = mongoose.Schema ({
  user_id: {type: String, required: true},
  event_id: {type: String, required: true},
  guests: [
    { firstName: {type: String, trim: true, required: true},
      lastName: {type: String, trim: true, required: true},
      email: {type: String, trim: true, required: true},
      rsvpStatus: {type: Number,  default: 0}, // ?
      plusOne: [
        {
          needed: {type: Boolean, default: false},
          number: {type: Number }, //default: 0 ?
          firstName: {type: String, trim: true, required: true},
          lastName: {type: String, trim: true, required: true},
        }
      ]
    }
  ],
  createdDate: {type: Date, required: true}, 
});

guestSchema.methods.toClient = function() {
  return {
    id: this._id,
    user_id: this.user_id,
    event_id: this.event_id,
    guests: [
      { name: `${this.firstName} ${this.lastName}`,
        email: this.email,
        rsvpStatus: this.rsvpStatus,
        plusOne: [
          {
            needed: this.needed,
            number: this.number, //default: 0 ?
            name: `${this.firstName} ${this.lastName}`
          }
        ]
      }
    ],
    createdDate: {type: Date, required: true}, 
    }
}

guestSchema.virtual('fulllName').get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = { Guest };