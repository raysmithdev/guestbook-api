const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const eventSchema = mongoose.Schema ({
  userId: {type: String, required: true},
  name: {type: String, trim: true, required: true},
  description: {type: String, trim: true},
  startDateTime: {type: Date, required: true},
  endDateTime: {type: Date, required: true},
  locationName: {type: String, required: true},
  locationLink: {type: String, trim: true},
  locationMap: {type: String, trim: true},
  eventStatus: {type: Number, required: true, default: 1}, 
  guests_id: {type: String }, // required: true - would this error if host only created event w/o guest?
  createdDate: {type: Date, required: true}, 
});

eventSchema.methods.toClient = function() {
  return {
    id: this._id,
    userId: this.userId,
    name: this.name,
    description: this.description,
    startDateTime: this.startDateTime,
    endDateTime: this.endDateTime,
    locationName: this.locationName,
    locationLink: this.locationLink,
    locationMap: this.locationMap,
    eventStatus: this.eventStatus, 
    guest_id: this.guest_id, 
    createdDate: this.createdDate
    }
}

const Event = mongoose.model('Event', eventSchema);

module.exports = { Event };
// export default Event; 