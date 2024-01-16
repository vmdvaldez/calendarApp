import { useState } from "react";
import styles from "../../styles/Activities/Activities.module.css";
import { useOutletContext } from "react-router-dom";

export default function Activities(){
    const {activityList, setActivityList} = useOutletContext();
    const [activityToDisplay, setActivityToDisplay] = useState([...activityList])
    const [createNewEvent, setCreateNewEvent] = useState("");


    // ON HOVER OR CLICK show EDIT and DELETE
    // NAME CATEGORIES DATE_CREATED EDIT DELETE
    // ADD CREATE button

    // TODO: Add edit on click and add category description
    return(
        <section className={styles.activities}>
            <div className={styles.activitiescontainer}>
                <div className={styles.searchBar}>
                    <input 
                        type="text"
                        onChange={(e)=>{
                            if(e.target.value){
                                const newActivityDisplay = activityList.filter(activity=> activity.name.toLowerCase().includes(e.target.value.toLowerCase()))
                                setActivityToDisplay(newActivityDisplay)
                            }
                            else{
                                setActivityToDisplay([...activityList]);
                            }
                            setCreateNewEvent(e.target.value);
                        }}></input>
                </div>
                <ul className={styles.activityList}>
                    {createNewEvent && !activityList.find(a => a.name === createNewEvent) &&
                        <li>
                            <div className={styles.name}>{createNewEvent}</div>
                            <button>Create</button>
                        </li>
                    }
                    <li><div className={styles.name}>Name</div><div>Date Created</div></li>
                    {activityToDisplay.map(activity=>
                    <li key={activity.id} 
                        className={styles.activity}>
                            <div className={styles.name}>{activity.name}</div>
                            <div>{activity.date_created}</div>
                            {/* {activity.categories.map(c=><div>{c}</div>)} */}
                            {/* <div>{activity.categories}</div> */}
                            {/* <div className={styles.buttons}>
                                <button>Edit</button>
                                <button>Delete</button>
                            </div> */}
                    </li>
                    )}
                </ul>
            </div>
        </section>
    )
}