const chai = require('chai');
const chatiHttp = require('chai-http');
const should = chai.should();
const jwt = require('jsonwebtoken');
const faker = require('faker');

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
    console.log('test user->', testUser);
    console.log('test user id->', testUser._id);
    mockJwt = createAuthToken(testUser);
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
      let res;
      return chai
        .request(app)
        .get(`/api/users/${testUser._id}/events`) 
        .set('Authorization', `Bearer ${mockJwt}`)
        .then(_res => {
          res = _res;
          console.log('get res? ->', res);
          res.should.have.status(200);
          res.body.trackers.should.have.lengthOf.at.least(1);
          return Event.count();
        })
        .then(count => {
          res.body.events.should.have.lengthOf(count);
        });
    });
  })
})

