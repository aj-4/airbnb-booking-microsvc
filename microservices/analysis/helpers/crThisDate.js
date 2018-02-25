const axios = require('axios');
const dh = require('./dateHelpers');
const url = 'http://localhost';
const port = '3000';

module.exports = async (date, hostId) => {

    // const app = await require('../../server/index');

    dateUrl = date.replace(' ', '%20');
    dateUrl = dateUrl.replace(' ', '%20');

    if (hostId) {
        //getviews
        var { data } = await axios.get(`${url}:${port}/view/` + hostId + '/' + dateUrl);
        const viewCount = data.length;
        //getbookings
        var { data } = await axios.get(`${url}:${port}/booking/` + hostId + '/' + dateUrl);
        const bookCount = data ? data.length : 0;
        //getshstatus
        let { data: SHday } = await axios.get(`${url}:${port}/superhost/` + hostId);
        const shForThisDay = dh.getDateIndex(date) > dh.getDateIndex(SHday);
        //getcr
        const cr = bookCount ? bookCount / viewCount : 0;
        //return
        return {
            host: hostId,
            date: date,
            views: viewCount,
            bookings: bookCount,
            superhost: shForThisDay,
            conversion: cr
        }
    } else {
        //getallviews
        var { data } = await axios.get(`${url}:${port}/allviews/` + dateUrl);
        const viewCount = data.length;
        //getallbookings
        var { data } = await axios.get(`${url}:${port}/allbookings/` + dateUrl);
        const bookCount = data ? data.length : 0;
        //getcr
        const cr = bookCount ? bookCount / viewCount : 0;
        //return
        return {
            date: date,
            views: viewCount,
            bookings: bookCount,
            conversion: cr
        }
    }
    
}