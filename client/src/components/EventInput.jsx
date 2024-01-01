import styles from '../styles/EventInput.module.css';

export default function EventInput({activityList}){
    return(
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
                />
                <button type="button"
                    onClick={()=>{
                        
                    }}
                >add</button>
                <datalist id="activityList">
                    {activityList.map(activity=>{
                        return(<option key={activity} value={activity}>{activity}</option>)
                    })}
                </datalist>
            </form>
        </div>
    )
}