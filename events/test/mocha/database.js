const expect = require('chai').expect;
const cass = require('../../database/indexCassandra');
const db = require('../../database/index');

describe('Cassandra', () => {

  let eventData;

  before( async () => {
    
  });

  beforeEach(async () => {
      eventData = { listingId: String(Math.floor(Math.random() * 1000)), hostId: String(Math.floor(Math.random() * 1000)) };
  });

  describe('Database Functions', () => {
    it('should have functions to insert into tables', () => {
      expect(db.getView).to.be.a('function');
      expect(db.getBook).to.be.a('function');
    })
    it('should have function to retrieve from tables', () => {
      expect(db.addBook).to.be.a('function');
      expect(db.addView).to.be.a('function');
    })
  });

  describe('View Events', () => {
    it('should successfully insert a view event', async () => {
      await db.addView(eventData.hostId, eventData.listingId).saveAsync();
      const result = await db.getView(eventData.hostId);
      console.log(result);
      expect(result).to.be.a('object');
    });
  });
});