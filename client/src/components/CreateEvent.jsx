import { useContext } from "react";
import styles from '../styles/CreateEvent.module.css';
import { ActivityContext } from './CalendarContext';

export default function CreateEvent({ setCreateActivity, eventStates, setEventStates}){
    const {activityList} = useContext(ActivityContext);

    return(
        <form action="" method=''>
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
    )
}