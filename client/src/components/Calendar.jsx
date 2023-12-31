import styles from '../styles/Calendar.module.css';

import date from '../helper/date';

import CalendarDay from './CalendarDay';
import { useEffect, useState } from 'react';

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


    // useEffect(()=>{
    //     const protocol = "http://"
    //     const url = import.meta.env.VITE_BACKEND_URL
    //     const port = import.meta.env.VITE_BACKEND_PORT
    //     fetch(`${protocol}${url}:${port}/`,{
    //         method: "GET",
    //         mode: 'cors'
    //     })
    //     .then(x=>x.json())
    //     .then(y=>console.log(y));
    // })

    return(
     <section className={styles.calendar}>
        {/* <div className={styles.modal}>
            <div className={styles.content}>

            </div>
        </div> */}
        <div className={styles.container}>
            <h1>{date.getMonth(month)} {year}</h1>
            <div className={styles.grids}>
                {createCalendarDays()}
            </div>
            <button onClick={goToPrevMonth}>Prev</button>
            <button onClick={goToNextMonth}>Next</button>
        </div>
     </section>   
    )
}