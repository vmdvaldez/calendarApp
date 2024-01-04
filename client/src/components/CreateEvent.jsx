import { useContext, useState } from "react";
import styles from '../styles/CreateEvent.module.css';
import { ActivityContext } from './CalendarContext';

export default function CreateEvent({ setCreateActivity, eventStates, setEventStates, date}){
    const {activityList} = useContext(ActivityContext);
    const [createStatus, setCreateStatus] = useState({status: 0, message: ""});

    const submitForm = async (e) =>{
        e.preventDefault();
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        const res = await fetch(`${fullPath}/createevent`, 
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
        json.status = 101
        console.log(json)
        setCreateStatus(json);

    };

    return(
        <>
            <form action="" method='' onSubmit={submitForm}>
                Title
                <input 
                    type="text" 
                    name='title'
                    value={eventStates.title}
                    onChange={e=>setEventStates({...eventStates, title: e.target.value})} 
                    required />
                Start
                <input 
                    type='time' 
                    name='start_time' 
                    value={eventStates.start}
                    onChange={e=>setEventStates({...eventStates, start: e.target.value})}
                    />
                End
                <input 
                    type='time' 
                    name='end_time' 
                    value={eventStates.end}
                    onChange={e=>setEventStates({...eventStates, end: e.target.value})}
                    />

                Activity
                <input type="text" 
                    name="activity" 
                    list="activityList" 
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
                <button type="button"
                    onClick={()=>{setCreateActivity(true)}}
                >add</button>
                
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