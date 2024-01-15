import { useState } from "react";
import styles from "../../styles/Activities/Activities.module.css";
import { useOutletContext } from "react-router-dom";

export default function Activities(){
    const {activityList, setActivityList} = useOutletContext();
    const [activityToDisplay, setActivityToDisplay] = useState([...activityList])

    // NAME CATEGORIES DATE_CREATED EDIT DELETE
    return(
        <section className={styles.activities}>
            <div>
                <input 
                    type="text"
                    onChange={(e)=>{
                        setActivityToDisplay(
                            activityList.filter(activity=> activity.name.toLowerCase().includes(e.target.value.toLowerCase())
                            ))
                    }}></input>
                {activityToDisplay.map(activity=><div>{activity.name}</div>)}
            </div>
        </section>
    )
}