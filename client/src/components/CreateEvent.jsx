import { useContext, useState } from "react";
import styles from '../styles/CreateEvent.module.css';
import { ActivityContext } from './CalendarContext';

export default function CreateEvent({ setCreateActivity, eventStates, 
    setEventStates, date, eventList, setEventList, clearEventStates}){
    const {activityList} = useContext(ActivityContext);
    const [createStatus, setCreateStatus] = useState({status: 0, message: ""});
    const day = (new Date(date)).getDate();
    console.log(eventStates);
    const submitForm = async (e) =>{
        e.preventDefault();
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        const res = await fetch(`${fullPath}/events`, 
            {
                method: "POST",
                headers: {
                    mode: "cors",
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...eventStates, date})
            }
        )
        const json = await res.json();
        if (json.status < 300){
            const newEventList = eventList.concat([{ 
                id: json.eventid , 
                title: eventStates.title, 
                activity:eventStates.activity,
                time_start: eventStates.start,
                time_end: eventStates.end
            }]);

            newEventList.sort((a,b)=>{
                if (a.time_start < b.time_start) return -1
                
                if (a.time_start > b.time_start) return 1

                if (a.time_end < b.time_end) return -1

                if (a.time_end > a.time_end) return 1
                return 0
            })
            setEventList(newEventList)
        }
        setCreateStatus(json);
        clearEventStates();
    };

    return(
        <>
            <form className={styles.formcontainer} onSubmit={submitForm}>
                <label htmlFor={`event_name_${day}`}>Title</label>
                <input 
                    type="text" 
                    name='title'
                    id={`event_name_${day}`}
                    value={eventStates.title}
                    onChange={e=>setEventStates({...eventStates, title: e.target.value})} 
                    required />
                <label htmlFor={`event_start_time_${day}`}>Start Time</label>
                <input 
                    type='time' 
                    name='start_time'
                    id={`event_start_time_${day}`}
                    value={eventStates.start}
                    onChange={e=>setEventStates({...eventStates, start: e.target.value})}
                    />
                <label htmlFor={`event_end_time${day}`}>End Time</label> 
                <input 
                    type='time' 
                    name='end_time'
                    id={`event_end_time${day}`} 
                    value={eventStates.end}
                    onChange={e=>setEventStates({...eventStates, end: e.target.value})}
                    />
                <div className={styles.eventactivity}>
                    <label htmlFor={`event_activity_${day}`}>Activity</label>
                    <button type="button"
                        onClick={()=>{setCreateActivity(true)}}
                    >add</button>
                </div>
                <input type="text" 
                    name="activity" 
                    list="activityList"
                    id={`event_activity_${day}`}
                    autoComplete='off'
                    onBlur={(e)=>{
                        const elem = e.target
                        const val = elem.value
                        if(val != "" && !activityList.includes(val)){
                            elem.setCustomValidity("Error: Please Create Entered Activity.");
                            elem.reportValidity();
                        }
                    }}
                    value={eventStates.activity}
                    onChange={e=>setEventStates({...eventStates, activity: e.target.value})}
                />

                
                <datalist id="activityList">
                    {activityList.map(activity=>{
                        return(<option key={activity} value={activity}>{activity}</option>)
                    })}
                </datalist>
                <button type="submit">Submit</button>
            </form>
            {createStatus.status >= 300 && 
                <div>
                    {createStatus.message}
                </div>
            }
        </>

    )
}