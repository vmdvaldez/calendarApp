import styles from '../../styles/Calendar/Calendar.module.css';

import date from '../../helper/date';

import CalendarDay from './CalendarDay';
import { ActivityContext, CategoryRefreshContext, CategoryContext } from './CalendarContext';
import { useState} from 'react';
import { useOutletContext } from 'react-router-dom';


export default function Calendar(){
    const [month, setMonth] = useState((new Date()).getMonth());
    const [year, setYear] = useState((new Date).getFullYear());
    const {activityList, setActivityList} = useOutletContext();
    const {categoryList, setCategoryList} = useOutletContext();
    const {refreshCategoryList} = useOutletContext();
    const [jumpTo, setJumpTo] = useState(false);
    // TODO: get events sorted in date

    const createCalendarDays = ()=>{
        const totalDays = date.getDaysInMonth(month, year);
        const grids = [];
        for (let i = 0; i < totalDays; i++){
            grids.push(
            <CalendarDay 
                key={`${month}${i+1}${year}`} 
                month={month} day={i+1} 
                year={year}/>
            );
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
    <ActivityContext.Provider value={{activityList, setActivityList}}>
        <CategoryContext.Provider value={{categoryList, setCategoryList}}>
            <CategoryRefreshContext.Provider value={{refreshCategoryList}}>
                <section className={styles.calendar}>
                    <div className={styles.container}>
                        {jumpTo ?
                            <input 
                                type="month"
                                value={`${year}-${(month+1) < 10 ? `0${month+1}` : month + 1}`}
                                onKeyDown={(e)=>e.preventDefault()}
                                onBlur={()=>{setJumpTo(false)}}
                                onChange={(e)=>{
                                    const [year, month] = e.target.value.split("-");
                                    setMonth(+month - 1)
                                    setYear(+year)
                                    setJumpTo(false);
                                }}
                                onFocus={(e)=>e.target.showPicker()}
                                autoFocus
                            /> : 
                            <h1 onClick={()=>{
                                setJumpTo(true);
                            }}>{date.getMonth(month)} {year} </h1>
                        }
                        <div className={styles.grids}>
                            {createCalendarDays()}
                        </div>
                        <div className={styles.buttons}>
                            <button onClick={goToPrevMonth}>Prev</button>
                            <button onClick={goToNextMonth}>Next</button>
                        </div>
                    </div>
                </section>
            </CategoryRefreshContext.Provider>   
        </CategoryContext.Provider>
    </ActivityContext.Provider>
    )
}