import styles from '../styles/CalendarDay.module.css';

export default function CalendarDay({day}){
    return(
        <div className={styles.day}>
            <div className={styles.num}>{day}</div>
        </div>
    )
}