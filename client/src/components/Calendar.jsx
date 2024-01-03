import styles from '../styles/Calendar.module.css';

import date from '../helper/date';

import CalendarDay from './CalendarDay';
import { ActivityContext, CategoryContext } from './CalendarContext';
import { useEffect, useState} from 'react';


export default function Calendar(){
    const [month, setMonth] = useState((new Date()).getMonth());
    const [year, setYear] = useState((new Date).getFullYear());
    const [activityList, setActivityList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
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

    useEffect(()=>{
        async function getActivities(){
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const res = await fetch(`${protocol}${url}:${port}/activity`, {
                method: "GET",
                headers:{
                    mode: "cors"
                }
            })
            const json =  await res.json();
    
            return json
        }
    
        getActivities().then(activities => {
            setActivityList(activities.map(activity=>activity.name));
        });

    },[])

    useEffect(()=>{
        async function getCategories(){
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const res = await fetch(`${protocol}${url}:${port}/categories`, {
                method: "GET",
                headers:{
                    mode: "cors"
                }
            })
            const json =  await res.json();
            return json
        }

        getCategories().then(categories => {
            setCategoryList(categories.map(category=>category.name));
        });
    },[]);

    return(
    <ActivityContext.Provider value={{activityList, setActivityList}}>
        <CategoryContext.Provider value={{categoryList, setCategoryList}}>
            <section className={styles.calendar}>
                <div className={styles.container}>
                    <h1>{date.getMonth(month)} {year}</h1>
                    <div className={styles.grids}>
                        {createCalendarDays()}
                    </div>
                    <button onClick={goToPrevMonth}>Prev</button>
                    <button onClick={goToNextMonth}>Next</button>
                </div>
            </section>   
        </CategoryContext.Provider>
    </ActivityContext.Provider>
    )
}