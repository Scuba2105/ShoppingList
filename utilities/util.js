const { DateTime } = require("luxon");

function getEndDate() {
    // Monday is 1 through to Sunday which is 7. 
    const currentDate = DateTime.now();
    const dayOfWeek = currentDate.weekday;
    let daysElapsed;
    if (dayOfWeek == 1) {
        daysElapsed = 6;
    }
    else {
        daysElapsed = dayOfWeek - 2;
    }
    const daysToEnd = 6 - daysElapsed;
    const dateEnd = currentDate.plus({days: daysToEnd});
    return dateEnd;
}

module.exports = {getEndDate};