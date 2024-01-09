import { useEffect, useState } from 'react';
import styles from '../styles/CalendarDay.module.css';
import EventInput from './EventInput';
import EventSummary from './EventSummary';

export default function CalendarDay({day, month, year}){
    const [clicked, setClicked] = useState(false);
    const [eventClicked, setEventClicked] = useState({id: null, clicked: false});
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
        <div className={styles.daycontainer} onClick={()=>setClicked(!clicked)}>
            {clicked && 
                <EventInput 
                eventList={events} 
                setEventList={setEvents} 
                date={date}/>}
            


            <div className={styles.day}>
                <div className={styles.num}>{day}</div>
                <ul className={styles.eventsummary}>
                    {events.map(ev=>{
                        return(
                            <>
                            {eventClicked.id == ev.id &&
                                <EventSummary eventId={ev.id}/>}
                            <li key={ev.id}
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    if (eventClicked.id == ev.id){
                                        setEventClicked({id: null, clicked: false});
                                    }
                                    else{
                                        setEventClicked({id: ev.id, clicked: true});
                                    }
                                    }}>
                            {ev.title}</li>
                            </>
                        )
                    })}
                </ul>
                {/* ADD SUMMARY HERE */}
            </div>
        </div>
    )
}