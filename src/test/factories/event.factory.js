const faker = require('faker');

function createOne(userId) {
  return {
    userId: userId,
    name: faker.hacker.phrase(),
    description: faker.company.catchPhraseDescriptor(),
    startDateTime: faker.date.future(),
    endDateTime: faker.date.future(),
    locationName: faker.hacker.noun(),
    locationAddress: faker.address.streetAddress(),
    eventStatus: 1
  }
}

function createMany(userId, num) {
  let events = [];
  for (let i = 0; i < num; i++) {
    events.push(createOne(userId));
  }
  return events;
}

module.exports = { createOne, createMany };