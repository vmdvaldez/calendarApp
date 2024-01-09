import { useEffect, useState } from 'react';
import styles from '../styles/EventSummary.module.css';
export default function EventSummary({eventId, removeEventById}){
    const [eventInfo, setEventInfo] = useState(null);
    useEffect(()=>{
        const grabEvents = async()=>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const fullPath = `${protocol}${url}:${port}`
            const query = new URLSearchParams({id: eventId});
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

        grabEvents().then(info=>setEventInfo(info));

    },[eventId]);

    // TODO add Description per event?
    return(
        <div className={styles.modal} onClick={(e)=>{e.stopPropagation()}}>
            {eventInfo && 
                <>
                <h1>{eventInfo.title}</h1>
                <p className={styles.time}>{`${eventInfo.time_start} to ${eventInfo.time_end}`}</p>
                <div className={styles.activityInfo}>
                <h2>{eventInfo.activity}</h2>
                    <ul className={styles.categories}>
                        {eventInfo.categories.map(category=>{
                            return(
                                <li key={`${eventInfo.id}_${category}`}>{category}</li>
                            )}
                        )}
                    </ul>
                </div>
                <p className={styles.time}>Created: {eventInfo.date_created}</p>
                <button type="button" onClick={()=>{
                    removeEventById(eventInfo.id);
                }}>Delete</button>
                </>
            }
        </div>

        
    )
}
