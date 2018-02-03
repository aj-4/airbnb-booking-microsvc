const init = require('./indexCassandra');
const getBook = require('./bookRetrieval');
const addBook = require('./bookInsertion');
const addView = require('./viewInsertion');

module.exports = {
    init,
    getBook,
    addBook,
    addView
}