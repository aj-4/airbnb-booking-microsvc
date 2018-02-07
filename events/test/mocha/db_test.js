const expect = require('chai').expect;
const cass = require('../../database/indexCassandra');
const db = require('../../database/index');
const helpers = require('./mochaHelpers');

describe('Cassandra', () => {

  const eventData = [];
  const today = Date().slice(4, 15);
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
        await entry.saveAsync();
      } catch(err) {
        throw new Error('view event fn failed');
      }
    })
    it('should retrieve a view event by host + date', async() => {
      let result = await db.getView(eventData[0].hostId, today);   
      expect(result).to.be.a('array');
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
        expect(entry).to.have.property('view_id');
        await entry.saveAsync();
      })
      let elapsed = Date.now() - begin;
      expect(elapsed).to.be.lessThan(50);
    })
    it('should retrieve 10 events faster than 200ms', async () => {
      let results = [];
      let promises = [];
      eventData.forEach(async (event, i) => {
        promises.push(db.getView(event.hostId, today).then(res => results.push(res)));
      })
      await Promise.all(promises);
      let elapsed = Date.now() - begin;
      expect(results.length).to.equal(eventData.length);
      expect(elapsed).to.be.lessThan(200);
    })
    it('should insert 1000 events faster than 300ms', async () => {
      let i = 1
      let promises = [];
      while( i < 1000 ) {
        let event = eventData[0];
        promises.push(db.addView(event.hostId, event.listingId));
        i++;
      }
      await Promise.all(promises);
      let elapsed = Date.now() - begin;
      expect(elapsed).to.be.lessThan(300);
    })
  });
});