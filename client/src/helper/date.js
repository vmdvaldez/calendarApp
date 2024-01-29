const date = (()=>{
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ]
    
    const months = monthNames.length;
    const days = dayNames.length;

    // @param monthIndex: val returned by Date().getMonth()
    function getMonth(monthIndex){
        return monthNames[monthIndex];
    }

    // @param monthIndex: val returned by Date().getDay()
    function getDay(dayIndex){
        return dayNames[dayIndex];
    }

    // Monday is the start of the week => (newDate.getDay() + 6 ) % 7
    function getStartOfWeek(date){
        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() - (newDate.getDay() + 6)%7);
        return newDate
    }

    function getStartOfMonth(date){
        const newDate = new Date(date);
        newDate.setDate(1);
        return newDate
    }

    function getNthDayFrom(date, inc){
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() + inc);
        return newDate
    }

    function getNextDay(date){
        return getNthDayFrom(date, 1);
    }

    function getPrevWeek(date){
        return getNthDayFrom(date, -7);
    }

    function getNextWeek(date){
        return getNthDayFrom(date, 7);
    }

    function getNthMonthfrom(date, inc){
        const newDate = new Date(date)
        newDate.setMonth((date.getMonth()+inc))
        return newDate;
    }

    function getPrevMonth(date){
        return getNthMonthfrom(date, -1)
    }

    function getNextMonth(date){
        return getNthMonthfrom(date, 1);
    }

    function parseDate(date){
        return{
            day: getDay(date.getDay()),
            month: getMonth(date.getMonth()),
            date: date.getDate(),
            year: date.getFullYear(),
            hours: date.getHours(),
            mins: date.getMinutes()
        }
    }

    function getCurrentDate(){
        const date = new Date();
        return parseDate(date);
    }


    function isLeapYr(year){
        return (year % 4) || ((year % 100 === 0) && (year % 400) ) ? 0 : 1;
    }

    function getDaysInMonth(month, year){
        month += 1 // month is assumed to be 0-indexed;
        const leapYr = isLeapYr(year);
        return (month === 2) ? (28 + leapYr) : 31 - (month - 1) % 7 % 2;
    }

    return {getMonth, getDay, parseDate, getCurrentDate, getDaysInMonth, 
        getStartOfWeek, getStartOfMonth, getNextDay, getPrevWeek, 
        getNextWeek, getPrevMonth, getNextMonth,
        months, days}
})();



export default date;