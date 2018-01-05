// require("babel-polyfill");
const chai = require('chai');
const chatiHttp = require('chai-http');
const should = chai.should();
const jwt = require('jsonwebtoken');
// const faker = require('faker');

const mongoose = require('mongoose');

const { app, runServer, closeServer } = require('../server');
const { JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL } = require('../config');
const { Event } = require('../event/event.model');
const { Guest } = require('../event/guest.model');
const { User } = require('../user/user.model');

const eventFactory = require('../test/factories/event.factory');
const userFactory = require('../test/factories/user.factory.js');

chai.use(chatiHttp);

// delete entire database
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('deleting test database');
    mongoose.connection
      .dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

// auth token for test user
const createAuthToken = user => {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  });
}

// create test user
function createTestUser() {
  console.info('creating test user');
  const testUser = userFactory.createOne();
  return User.create(testUser);
}

// create random events
function seedEventData(userId) {
  console.info('seeding events');
  const seedData = eventFactory.createMany(userId, 5);
  return Event.insertMany(seedData);
}

describe('events API', function() {
  let testUser;
  let mockJwt;

  // start server before test
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(async function() {
    testUser = await createTestUser();
    // console.log('test user->', testUser);
    // console.log('test user id->', testUser._id);
    mockJwt = createAuthToken(testUser);
    // console.log('mockJwt ->', mockJwt);
    return seedEventData(testUser._id);
  });

  // remove database after each test
  afterEach(function() {
    return tearDownDb();
  });

  // close server after test is done
  after(function() {
    return closeServer();
  });

  // GET endpoint
  describe('GET endpoint', function() {
    const expectedKeys = [
      'id', 'userId', 'name', 'description', 'startDateTime',
      'locationName', 'locationAddress'
    ]

    it('return all existing events', function() {
      // console.log('test user in GET endpoint? ->', testUser);

      let res;
      return chai
        .request(app)
        .get(`/api/user/${testUser._id}/events`) 
        .set('Authorization', `Bearer ${mockJwt}`)
        .then(_res => {
          res = _res;
          // console.log('get res? ->', res);
          res.should.have.status(200);
          res.body.events.should.have.lengthOf.at.least(1);
          return Event.count();
        })
        .then(count => {
          res.body.events.should.have.lengthOf(count);
        });
    });

    it('events should return with expected keys', function() {
      let resEvent;
      return chai
        .request(app)
        .get(`/api/user/${testUser._id}/events`) 
        .set('Authorization', `Bearer ${mockJwt}`)
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.events.should.be.a('array');
          res.body.events.should.have.lengthOf.at.least(1);

          // check each response for expected keys
          res.body.events.forEach(function(event) {
            event.should.be.a('object');
            event.should.include.keys(expectedKeys);
          });

          // retrieve single event & check for correct values
          resEvent = res.body.events[0];
          return Event.findById(resEvent.id);
        })
        .then(function(event) {
          resEvent.userId.should.equal(event.userId);
          resEvent.name.should.equal(event.name);
          resEvent.description.should.equal(event.status);
          resEvent.locationName.should.equal(event.locationName);
          resEvent.locationAddress.should.equal(event.locationName);
          resEvent.startEndTime.should.equal(event.startEndTime);
        });
    });
  
  // POST endpoint
  describe('POST endpoint', function() {
    const expectedKeys = [
      'id', 'userId', 'name', 'description', 'startDateTime',
      'locationName', 'locationAddress'
    ];

    it('create a new event', function() {
      const newEvent = eventFactory.createOne();
      return chai
        .request(app)
        .post(`/api/user/${testUser._id}/events`)
        .set('Authorization', `Bearer ${mockJwt}`)
        .send(newEvent)
        .then(function(res) {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys(expectedKeys);
          res.body.name.shold.equal(newEvent.name);
          res.body.description.should.equal(newEvent.description);
          res.body.locationName.should.equal(newEvent.locationName);
          res.body.locationAddress.should.equal(newEvent.locationAddress);
          res.body.status.should.equal(1);
          res.body.id.should.not.be.null;
        });
    });
  })
  })
})

