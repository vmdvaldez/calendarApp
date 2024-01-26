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

    function getStartOfWeek(date){
        const newDate = new Date(date)
        newDate.setDate(newDate.getDate() - newDate.getDay() + 1);
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

    function getNextWeek(date){
        return getNthDayFrom(date, 7);
    }

    function getCurrentDate(){
        const date = new Date();
        return{
            day: getDay(date.getDay()),
            month: getMonth(date.getMonth()),
            date: date.getDate(),
            year: date.getFullYear(),
            hours: date.getHours(),
            mins: date.getMinutes()
        }
    }

    function isLeapYr(year){
        return (year % 4) || ((year % 100 === 0) && (year % 400) ) ? 0 : 1;
    }

    function getDaysInMonth(month, year){
        month += 1 // month is assumed to be 0-indexed;
        const leapYr = isLeapYr(year);
        return (month === 2) ? (28 + leapYr) : 31 - (month - 1) % 7 % 2;
    }

    return {getMonth, getDay, getCurrentDate, getDaysInMonth, 
        getStartOfWeek, getNextDay, getNextWeek,
        months, days}
})();



export default date;