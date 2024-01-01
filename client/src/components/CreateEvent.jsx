import { useState } from "react";
import styles from '../styles/CreateEvent.module.css';

export default function CreateEvent({activityList, setCreateActivity}){
    return(
        <form action="" method=''>
            Title<input type="text" name='title' required></input>
            Start<input type='time' name='start_time'></input>
            End<input type='time' name='end_time'></input>

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
            />
            <button type="button"
                onClick={()=>{
                    setCreateActivity(true)
                }}
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