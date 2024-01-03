import { useState } from 'react';
import styles from '../styles/CalendarDay.module.css';
import EventInput from './EventInput';

export default function CalendarDay({day, month, year}){
    const [clicked, setClicked] = useState(false);

    return(
        <div className={styles.day  }
            onClick={()=>setClicked(!clicked)}>
            {clicked && <EventInput />}
            <div className={styles.num}>{day}</div>
            {/* ADD SUMMARY HERE */}
        </div>
    )
}