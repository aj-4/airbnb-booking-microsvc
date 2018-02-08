//Note, dates must be in string format of 'Feb 07 2018'
//this is possible by calling Date().slice(4, 15) in JS

const dateHelper = require('./helpers/dateHelpers');
const getConversionForDay = require('./helpers/crThisDate');

const crDateRange = (hostId, dateStringStart, dateStringEnd) => {
    //parse dates for manipulation
    let startDate = { day: Number(dateStringStart.slice(4, 6)), month: dateStringStart.slice(0, 3), year: dateStringStart.slice(-4)};
    let endDate = { day: Number(dateStringEnd.slice(4, 6)), month: dateStringEnd.slice(0, 3), year: dateStringEnd.slice(-4) };

    //get total days to create loop
    let dayCount = dateHelper.getDateIndex(dateStringEnd) - dateHelper.getDateIndex(dateStringStart);

    //create array of all dates
    const allDays = [];
    
    //increase this date to iterate
    let thisDate = startDate;

    for (let i = 0; i <= dayCount; i++) {
        //test
        allDays.push(thisDate.month + ' 0' + thisDate.day + ' ' + thisDate.year);
        //first call endpoints for day

        //then increment month
        if (thisDate.day === dateHelper.daysInMonth[thisDate.month]) {
            thisDate.month = dateHelper.monthsArray[dateHelper.monthToNum[thisDate.month] + 1];
            thisDate.day = 1;
        } else {
            //...or day
            thisDate.day++;
        }
    }


    // returns object with data for each day
    const conversionRates = allDays.map( (day, i) => {
        return getConversionForDay(hostId, day);
    })

    return Promise.all(conversionRates);
}

crDateRange(4195, 'Jan 06 2018', 'Feb 08 2018').then(crs => {
    console.log(crs)
});