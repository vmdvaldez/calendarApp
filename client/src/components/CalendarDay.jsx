import { useState } from 'react';
import styles from '../styles/CalendarDay.module.css';

export default function CalendarDay({day}){
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
                    <input type="text" list="activityList"></input>
                    <datalist id="activityList">
                        {/* Add activity here */}
                        <option value="A">A</option>
                        <option value="B">B</option>
                    </datalist>
                    <button type="button">new Activity</button>
                    <button type="submit">Submit</button>

                </form>
            </div>}
            <div className={styles.num}>{day}</div>
            {/* ADD SUMMARY HERE */}
        </div>
    )
}