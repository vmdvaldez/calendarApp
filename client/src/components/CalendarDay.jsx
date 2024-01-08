import { useEffect, useState } from 'react';
import styles from '../styles/CalendarDay.module.css';
import EventInput from './EventInput';

export default function CalendarDay({day, month, year}){
    const [clicked, setClicked] = useState(false);
    const [events, setEvents] = useState([])
    const date = new Date(year, month, day).toISOString();

    useEffect(()=>{
        const grabEvents = async()=>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const fullPath = `${protocol}${url}:${port}`
            const query = new URLSearchParams({date: date});
            const res = await fetch(`${fullPath}/events?` + query, 
                {
                    method: "GET",
                    headers: {
                        mode: "cors",
                    }
                }
            )

            return res.json();
        }

        grabEvents().then(events=>setEvents(events));

    },[month, day, year]);

    // TODO: Add Event Grabbing

    return(
        <div className={styles.day  }
            onClick={()=>setClicked(!clicked)}>
            {clicked && <EventInput date={date}/>}
            <div className={styles.num}>{day}</div>
            <ul>
                {events.map(e=>{
                    return(
                        <li>{e.title}</li>
                    )
                })}
            </ul>
            {/* ADD SUMMARY HERE */}
        </div>
    )
}