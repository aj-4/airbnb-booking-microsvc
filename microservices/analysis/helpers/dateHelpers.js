const daysInMonth = { Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30, Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31 };
const daysArray = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthsArray = [0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const monthToNum = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };

//This gets the DAY out of a YEAR to calculate the difference between any 2 dates
//Note, dates must be in string format of 'Feb 07 2018'
//this is possible by calling Date().slice(4, 15) in JS

const getDateIndex = (dateString) => {
    //value of day
    let daySum = Number(dateString.slice(4,6));
    let monthIndex = Number(monthToNum[dateString.slice(0,3)]);
    let year = Number(dateString.slice(-4));

    //add value of months before
    for (let i = 1; i < monthIndex; i++) {
        daySum += daysArray[i];
    };
    //return days so far in that year
    return daySum + 365 * year;
}

module.exports = {
    getDateIndex,
    daysInMonth,
    daysArray,
    monthsArray,
    monthToNum
};