import { useEffect, useState } from 'react';
import styles from '../../styles/Calendar/EventSummary.module.css';

//TODO: Add edit activity -- switching to a different activity
export default function EventSummary({eventId, removeEventById, displayRight}){
    const [eventInfo, setEventInfo] = useState(null);
    const [createStatus, setCreateStatus] = useState({status: 0, message: ""});
    useEffect(()=>{
        const grabEvents = async()=>{
            const protocol = "http://"
            const url = import.meta.env.VITE_BACKEND_URL
            const port = import.meta.env.VITE_BACKEND_PORT
            const fullPath = `${protocol}${url}:${port}`
            const res = await fetch(`${fullPath}/events/${eventId}`, 
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
        <div 
            className={displayRight ? styles.modalRight : styles.modalLeft} 
            onClick={(e)=>{e.stopPropagation()}}>
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
                <button type="button" onClick={async ()=>{
                        const protocol = "http://"
                        const url = import.meta.env.VITE_BACKEND_URL
                        const port = import.meta.env.VITE_BACKEND_PORT
                        const fullPath = `${protocol}${url}:${port}`
                        const res = await fetch(`${fullPath}/events/${eventId}`, 
                            {
                                method: "DELETE",
                                headers: {
                                    mode: "cors",
                                }
                            }
                        )
                        console.log(res)
                        const json = await res.json()
                        console.log(json)
                    if (json.status == 200){
                        removeEventById(eventInfo.id);
                    }
                    setCreateStatus(json);
                }}>Delete</button>
                {createStatus.status >= 300 && 
                    <p className={styles.error}>{createStatus.message}</p>
                }
                </>
            }
        </div>

        
    )
}
