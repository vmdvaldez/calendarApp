import { useEffect, useState, Fragment } from 'react';
import styles from '../../styles/Calendar/CalendarDay.module.css';
import EventInput from './EventInput';
import EventSummary from './EventSummary';

import dateHelper  from '../../helper/date';

export default function CalendarDay({day, month, year}){
    const [clicked, setClicked] = useState({clicked: false, displayRight: true});
    const [eventClicked, setEventClicked] = useState({id: null, clicked: false});
    const [events, setEvents] = useState([])
    const date = new Date(year, month, day);
    useEffect(()=>{
        const grabEvents = async()=>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const fullPath = `${protocol}${url}:${port}`
            const query = new URLSearchParams(
                {startDate: date.toISOString(), 
                endDate: dateHelper.getNextDay(date).toISOString()
                });
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

    function removeEventById(id){
        for (let i = 0; i < events.length; i++){
            if (events[i].id == id){
                setEvents(events.toSpliced(i, 1));
            }
        }
    }

    return(
        <div className={styles.daycontainer} onClick={(e)=>{
            setClicked({clicked: !clicked.clicked, 
                displayRight: e.pageX <= window.screen.width/2})
            }}>

            {clicked.clicked && 
                <EventInput 
                    displayRight={clicked.displayRight}
                    eventList={events} 
                    setEventList={setEvents} 
                    date={date}/>
            }
            
            <div className={styles.day}>
                <div className={styles.num}>{day}</div>
                <ul className={styles.eventsummary}>
                    {events.map(ev=>{
                        return(
                            <Fragment key={ev.id}>
                            {eventClicked.id == ev.id &&
                                <EventSummary 
                                    displayRight={eventClicked.displayRight}
                                    eventId={ev.id}
                                    removeEventById={removeEventById}
                                    />}
                            <li
                                onClick={(e)=>{
                                    e.stopPropagation();
                                    
                                    if (eventClicked.id == ev.id){
                                        setEventClicked({id: null, clicked: false, displayRight: e.pageX <= window.screen.width/2});
                                    }
                                    else{
                                        setEventClicked({id: ev.id, clicked: true, displayRight: e.pageX <= window.screen.width/2});
                                    }}}
                                    >
                            {ev.title}</li>
                            </Fragment>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}