import styles from '../styles/Calendar.module.css';

import date from '../helper/date';

import CalendarDay from './CalendarDay';

export default function Calendar({month, year}){
    month = 11;
    year = 2023

    const totalDays = date.getDaysInMonth(month, year);
    const createCalendarDays = ()=>{
        const grids = [];
        for (let i = 0; i < totalDays; i++){
            grids.push(<CalendarDay day={i+1}/>);
        }
        return grids
    }


    console.log(month, year, totalDays);
    return(
     <section className={styles.calendar}>
        <div className={styles.container}>
            <div>{date.getMonth(month)} {year}</div>
            <div className={styles.grids}>
                {createCalendarDays()}
            </div>
        </div>
     </section>   
    )
}