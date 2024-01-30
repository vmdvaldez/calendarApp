import { useContext, useEffect, useState } from 'react';
import {ActivityContext} from '../Calendar/CalendarContext';
import styles from '../../styles/Calendar/EventSummary.module.css';
import date from '../../helper/date';
//TODO: Add edit activity -- switching to a different activity
export default function EventSummary({eventId, removeEventById, displayRight, triggerEventUpdated}){
    const [eventInfo, setEventInfo] = useState(null);
    const [createStatus, setCreateStatus] = useState({status: 0, message: ""});

    const {activityList} = useContext(ActivityContext)
    const [editedInfo, setEditedInfo] = useState(null);
    const [editMode, setEditMode] = useState(false)
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

        grabEvents().then(info=>{
            setEventInfo(info)
            setEditedInfo({
                id: info.id,
                title: info.title,
                time_start: info.time_start,
                time_end: info.time_end,
                activity: info.activity
            })
        });
    },[eventId, createStatus]);

    
    async function submitEditRequest(e){
        e.preventDefault();

        if(editedInfo.activity != "" && !activityList.map(a=>a.name).includes(editedInfo.activity.trim().toUpperCase())){
            e.target.setCustomValidity("Error: Please Create Entered Activity.");
            e.target.reportValidity();
            return
        }
        else{
            e.target.setCustomValidity("");
        }
        

        console.log(editedInfo);
        // PUT VS PATCH
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        console.log(activityList);
        const res = await fetch(`${fullPath}/events/${eventId}`, 
            {
                method: "PUT",
                headers: {
                    mode: "cors",
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...editedInfo, 
                    activity_id: activityList.find((a=>a.name === (editedInfo.activity).trim().toUpperCase())).id
                })
            }
        )
        const json = await res.json();

        if(json.status >= 300){
            console.log(json.message);
        }else{
            setEditMode(false);
            triggerEventUpdated();
            setCreateStatus(json);
        }
    }

    // TODO add Description per event?
    return(
        <div 
            className={displayRight ? styles.modalRight : styles.modalLeft} 
            onClick={(e)=>{e.stopPropagation()}}>
            {eventInfo && 
                <>
                {editMode ? 
                    <input 
                        type="text" 
                        value={editedInfo.title}
                        onChange={(e)=>setEditedInfo({...editedInfo, 
                            time_start: date.standardToMilitaryTime(editedInfo.time_start),
                            time_end: date.standardToMilitaryTime(editedInfo.time_end),
                            title: e.target.value})}/> 
                    : 
                    <h1>{eventInfo.title}</h1>
                }
                {editMode ? 
                    <div>
                        <input 
                            type="time"
                            value={date.standardToMilitaryTime(editedInfo.time_start)}
                            onChange={(e)=>setEditedInfo({...editedInfo, time_start: e.target.value})}/>
                        to
                        <input 
                            type="time"
                            value={date.standardToMilitaryTime(editedInfo.time_end)}
                            onChange={(e)=>setEditedInfo({...editedInfo, time_end: e.target.value})}/>
                    </div>
                    : 
                    <p className={styles.time}>{`${eventInfo.time_start} to ${eventInfo.time_end}`}</p>}
                {editMode ? 
                    <>
                    <input 
                        type="text"
                        list="activity_list_event_sum"
                        value={editedInfo.activity}
                        onChange={(e)=>{
                            e.target.setCustomValidity("")
                            setEditedInfo({...editedInfo, activity: e.target.value})
                        }}
                        onBlur={(e)=>{
                            const elem = e.target
                            const val = elem.value
                            if(val != "" && !activityList.map(a=>a.name).includes(val.trim().toUpperCase())){
                                elem.setCustomValidity("Error: Please Create Entered Activity.");
                                elem.reportValidity();
                                return
                            }
                            else{
                                elem.setCustomValidity("");
                            }
                        }}
                        />
                        <datalist id="activity_list_event_sum">
                            {activityList.map(a=><option key={a.name} value={a.name}></option>)}
                        </datalist>
                    </>
                    :
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
                }
                <p className={styles.time}>Created: {eventInfo.date_created}</p>
                {editMode ? 
                <button type="button" onClick={submitEditRequest}>Submit</button>
                :
                <button type="button" onClick={()=>setEditMode(true)}>EDIT</button>
                }
                {editMode ? 
                    <button type="button" onClick={()=>setEditMode(false)}>CANCEL</button> 
                    : 
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
                }
                {createStatus.status >= 300 && 
                    <p className={styles.error}>{createStatus.message}</p>
                }
                </>
            }
        </div>

        
    )
}
