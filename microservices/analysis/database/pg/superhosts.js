//open connection to read slavez
const { Pool, Client } = require('pg');
const connection = process.env.POSTGRES_IP ?
    { connectionString: process.env.POSTGRES_IP } :
    { host: 'localhost', database: 'superhosts' }
const pool = new Pool(connection)
pool.connect();

const getShDate = (hostId) => {
    return pool.query('SELECT * FROM superhosts WHERE host_id = $1', [hostId])
};

//just for testing
const insertSuperHost = (hostId, date) => {
    return pool.query('INSERT INTO superhosts (host_id, date) VALUES ($1, $2)', [hostId, date])
}

module.exports = {
    getShDate,
    insertSuperHost
}