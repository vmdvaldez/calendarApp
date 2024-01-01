import { useEffect, useState } from 'react';
import styles from '../styles/CalendarDay.module.css';

export default function CalendarDay({day, month, year, activityList}){
    const [clicked, setClicked] = useState(false);


    return(
        <div className={styles.day  }
            onClick={()=>setClicked(!clicked)}>
            {clicked && 
            <div className={styles.modal} onClick={(e)=>{e.stopPropagation()}}>
                <form action="" method=''>
                    Title<input type="text" name='title' required></input>
                    Start<input type='time' name='start_time'></input>
                    End<input type='time' name='end_time'></input>

                    Activity
                    <input type="text" list="activityList" 
                        onBlur={(e)=>{
                            const elem = e.target
                            const val = elem.value
                            if(val != "" && !activityList.includes(val)){
                                elem.setCustomValidity("Error: Please Create Entered Activity.");
                                elem.reportValidity();
                            }
                        }}
                        ></input>
                    <datalist id="activityList">
                        {activityList.map(activity=>{
                            return(<option value={activity}>{activity}</option>)
                        })}
                    </datalist>

                </form>
            </div>}
            <div className={styles.num}>{day}</div>
            {/* ADD SUMMARY HERE */}
        </div>
    )
}