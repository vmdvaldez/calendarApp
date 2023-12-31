import styles from '../styles/Calendar.module.css';

import date from '../helper/date';

import CalendarDay from './CalendarDay';
import { useState } from 'react';

export default function Calendar(){
    const [month, setMonth] = useState((new Date()).getMonth());
    const [year, setYear] = useState((new Date).getFullYear());
    const createCalendarDays = ()=>{
        const totalDays = date.getDaysInMonth(month, year);
        const grids = [];
        for (let i = 0; i < totalDays; i++){
            grids.push(<CalendarDay key={`${month}${i+1}${year}`} day={i+1}/>);
        }
        return grids
    }

    const goToNextMonth = () => {
        if (month == date.months - 1){
            setMonth(0)
            setYear(year + 1)
        }
        else{
            setMonth(month + 1)
        }
    }

    const goToPrevMonth = ()=>{
        if (month <= 0){
            setMonth(date.months-1)
            setYear(year - 1)
        }
        else{
            setMonth(month - 1)
        }
    }

    return(
     <section className={styles.calendar}>
        <div className={styles.container}>
            <div>{date.getMonth(month)} {year}</div>
            <div className={styles.grids}>
                {createCalendarDays()}
            </div>
            <button onClick={goToPrevMonth}>Prev</button>
            <button onClick={goToNextMonth}>Next</button>
        </div>
     </section>   
    )
}