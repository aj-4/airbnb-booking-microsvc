const chai = require('chai');
const expect = require('chai').expect;
//hide logs in test mode
process.env.NODE_ENV = 'test';
const server = require('../../server/server')
const cass = require('../../database/indexCassandra');
const db = require('../../database/index');
const helpers = require('./mochaHelpers');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Cassandra', () => {

  const eventData = [];
  const today = Date().slice(4, 15);
  let insertedForHostId;
  let begin;

  beforeEach( () => {
      begin = Date.now();
  });

  describe('Database Functions', () => {
    it('should have functions to insert into tables', () => {
      expect(db.getView).to.be.a('function');
      expect(db.getBook).to.be.a('function');
    })
    it('should have functions to retrieve from tables', () => {
      expect(db.addBook).to.be.a('function');
      expect(db.addView).to.be.a('function');
    })
  });

  describe('View Events', () => {
    it('should insert a view event by host id, listing id', async () => {
      eventData.push(helpers.generateDbEntry());
      try {
        let entry = await db.addView(eventData[0].hostId, eventData[0].listingId);
      } catch(err) {
        throw new Error('view event fn failed');
      }
    })
    it('should retrieve a view event by host + date', async() => {
      let result = await db.getView(eventData[0].hostId, today);   
      expect(result).to.be.an('array');
      expect(result[0].host_id).to.equal(eventData[0].hostId);
      expect(result[0].date).to.equal(today);
    })
    it('should retrieve nothing for an invalid query', async () => {
      let result = await db.getView('invalidString', today);
      expect(result[0]).to.be.undefined;
    })
  });

  describe('Load Testing', () => {
    it('should insert 10 events faster than 50ms', async () => {
      eventData.pop();
      let i = 0;
      while (i < 10) {
        eventData.push(helpers.generateDbEntry());
        i++;
      }
      eventData.forEach(async (event) => {
        let entry = await db.addView(event.hostId, event.listingId);
      })
      let elapsed = Date.now() - begin;
      expect(elapsed).to.be.lessThan(50);
    })
    it('should retrieve 10 events faster than 600ms', async () => {
      let results = [];
      let promises = [];
      eventData.forEach(async (event, i) => {
        promises.push(db.getView(event.hostId, today).then(res => results.push(res)));
      })
      await Promise.all(promises);
      let elapsed = Date.now() - begin;
      expect(results.length).to.equal(eventData.length);
      expect(elapsed).to.be.lessThan(600);
    })
    it('should insert 100 events faster than 400ms', async () => {
      let i = 1
      let promises = [];
      while( i < 100 ) {
        let event = eventData[0];
        promises.push(db.addView(event.hostId, event.listingId));
        i++;
      }
      insertedForHostId = eventData[0].hostId;
      await Promise.all(promises);
      let elapsed = Date.now() - begin;
      expect(elapsed).to.be.lessThan(400);
    })
  });

  describe('Event Retrieval for Analysis', () => {
    it('should retrieve host events for a date', () => {
      let hostId = Math.floor(Math.random() * 9999);
      chai.request(server)
        .get('/view/' + insertedForHostId + '/' + today.replace(' ','%20'))
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          expect(res.body[0].date).to.equal(today);
        })
    })
  })
});

describe('Postgres', () => {
  it('should have a route to get analysis data', () => {
    let hostId = Math.floor(Math.random() * 9999);
    chai.request(server)
      .get('/superhost/' + hostId)
      .end((err, res) => {
        expect(res).to.have.status(200);
      })
  })
  it('should return date for when superhosts gained status', () => {
    let hostId = Math.floor(Math.random() * 9999);
    chai.request(server)
      .get('/superhost/' + hostId)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('string');
        expect(res.body.length).to.be.greaterThan(5);
        expect(res.body.slice(-4)).to.be('2018');
      })
  })
  it('should return undefined for normal hosts', () => {
    chai.request(server)
      .get('/superhost/' + 10001)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.undefined;
      })
  })
});

describe('Redis', () => {
  it('should be much faster than a db request', async() => {
    let hostId = Math.floor(Math.random() * 9999);
    let begin1 = Date.now();
    chai.request(server)
      .get('/superhost/' + hostId)
      .end((err, res) => {
        let time1 = Date.now() - begin1;
        let begin2 = Date.now();
        chai.request(server)
          .get('/superhost/' + hostId)
          .end((err, res) => {
            let time2 = Date.now() - begin;
            expect(res).to.have.status(200);
            expect(time2).to.be.lessThan(time1);
          })
      })
  })
  it('should retrieve items in less than 20ms from the cache', async () => {
    let hostId = Math.floor(Math.random() * 9999);
    chai.request(server)
      .get('/superhost/' + hostId)
      .end((err, res) => {
        let begin = Date.now();
        chai.request(server)
          .get('/superhost/' + hostId)
          .end((err, res) => {
            let end = Date.now() - begin;
            expect(res).to.have.status(200);
            expect(end).to.be.lessThan(20);
          })
      })
  })
});
