const axios = require('axios');
const dh = require('./dateHelpers');
const url = 'http://localhost';
const port = '3000';

module.exports = async (hostId, date) => {

    // const app = await require('../../server/index');

    console.log('date before replace', date);
    dateUrl = date.replace(' ', '%20');
    dateUrl = dateUrl.replace(' ', '%20');

    //get all views
    var {data} = await axios.get(`${url}:${port}/view/` + hostId + '/' + dateUrl);
    const viewCount = data.length;

    //get all bookings
    var { data } = await axios.get(`${url}:${port}/booking/` + hostId + '/' + dateUrl);
    const bookCount = data ? data.length : 0;

    //get superhost status
    let { data: SHday } = await axios.get(`${url}:${port}/superhost/` + hostId);
    const shForThisDay = dh.getDateIndex(date) > dh.getDateIndex(SHday);
    
    //calculate daily conversion
    //total bookings / total views
    const cr = bookCount ? bookCount / viewCount : 0;

    //return obj w/ date, views, bookings, superhost, conversion
    return {
        date: date,
        views: viewCount,
        bookings: bookCount,
        superhost: shForThisDay,
        conversion: cr
    }
}