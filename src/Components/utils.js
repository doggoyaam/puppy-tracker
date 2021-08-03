import moment from 'moment';


const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const _ms_to_sec = 1000;
const _ms_to_min = 1000 * 60;
const _ms_to_hour = 1000 * 60 * 60;

export const getDates = (numDaysBack) => {
    let today = new Date();

    var dateArray = [];
    for (var i = 0; i < numDaysBack; i++) {
        // get the date for each date to look in past
        // first item should be today
        if (i === 0) {
            var tdateString = moment(today).format('YYYY-MM-DD');
            dateArray.push(tdateString);
        }
        else {
            let dayAgoObj = new Date();
            dayAgoObj.setDate(today.getDate() - i);
            var adateString = moment(dayAgoObj).format('YYYY-MM-DD');

            dateArray.push(adateString);
        }
    }

    return dateArray;
}





// a and b are javascript Date objects
export const dateDiffs = (a, b) => {
    // Discard the time and time-zone information.
    // const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    // const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const d = Math.abs(b - a);
    // console.log(d);

    const secs = d / _ms_to_sec;
    const mins = d / _ms_to_min;
    const hours = d / _ms_to_hour;
    const days = Math.floor(d / _MS_PER_DAY);
    // console.log(secs, mins, hours, days);

    const ret = {
        seconds: secs,
        minutes: mins,
        hours: hours,
        days: days
    }
    return ret;
}


// export const to =  take in the above date oobject and return a human redible subtit=>le
// dictating how long ago the event took place
// scheme: 
// - If minutes <= 1 . Display seconds ago
// - If hours <= 1. Display minutes, seconds ago
// - If days <= 1. Display hours, minutes ago
// - If days > 0. Display Days ago


export const fmtTimeAgo = (dObj) => {
    var s = null;

    if (dObj.minutes <= 1) {
        var secsAll = Math.floor(dObj.seconds);

        s = `${secsAll}s ago`;
    }
    else if (dObj.hours <= 1) {
        var minsAll = Math.floor(dObj.minutes);

        s = `${minsAll}m ago`;
    }
    else if (dObj.days < 1) {
        var hrs = Math.floor(dObj.hours);
        var minsAll = Math.floor(dObj.minutes);
        var minsLeft = minsAll - hrs * 60;
        s = `${hrs}h${minsLeft}m ago`;

        // just do hours ago 
        // s = `${hrs} hours ago`;


    }
    else if (dObj.days >= 1) {
        // var hrs = Math.floor(dObj.hours);
        // var minsAll = Math.floor(dObj.minutes);
        // var minsLeft = minsAll - hrs * 60;
        s = `${dObj.days} days ago`;

    }
    return s;

}