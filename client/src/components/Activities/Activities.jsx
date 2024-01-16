import { useState } from "react";
import styles from "../../styles/Activities/Activities.module.css";
import { useOutletContext } from "react-router-dom";

import CreateActivityForm from './CreateActivityForm';

export default function Activities(){
    const {
            activityList, setActivityList,
            categoryList, setCategoryList } = useOutletContext();
    const [activityToDisplay, setActivityToDisplay] = useState([...activityList])
    const [createNewEvent, setCreateNewEvent] = useState({name: "", clicked: false});
    

    const onCreateClick = ()=>{
        setCreateNewEvent({...createNewEvent, clicked: true});
    }

    const setCreateNewEventFalse = ()=>{
        setActivityToDisplay([...activityList]);
        setCreateNewEvent({name: "", clicked: false});
    }

    console.log(activityList);

    // ON HOVER OR CLICK show EDIT and DELETE
    // TODO: Add edit on click and add category description
    return(
        <section className={styles.activities}>
            {!createNewEvent.clicked &&
                <div className={styles.activitiescontainer}>
                    {!createNewEvent.clicked &&
                        <div className={styles.searchBar}>
                            <input 
                                type="text"
                                value={createNewEvent.name}
                                onChange={(e)=>{
                                    if(e.target.value){
                                        const newActivityDisplay = activityList.filter(activity=> activity.name.toLowerCase().includes(e.target.value.toLowerCase()))
                                        setActivityToDisplay(newActivityDisplay)
                                    }
                                    else{
                                        setActivityToDisplay([...activityList]);
                                    }
                                    setCreateNewEvent({...createNewEvent, name: e.target.value.trim()});
                                }}></input>
                        </div>
                    }
                    <ul className={styles.activityList}>
                        {createNewEvent.name && !activityList.find(a => a.name === createNewEvent.name) &&
                            <li className={styles.createList}>
                                    <div className={styles.createDiv}>
                                        <div className={styles.name}>{createNewEvent.name}</div>
                                        <button type="button" onClick={onCreateClick}>Create</button>
                                    </div>
                            </li>
                        }
                        {!createNewEvent.clicked && 
                        <>
                            <li><div className={styles.name}>Name</div><div>Date Created</div></li>
                            {activityToDisplay.map(activity=>
                            <li key={activity.id} 
                                className={styles.activity}>
                                    <div className={styles.name}>{activity.name}</div>
                                    <div>{activity.date_created}</div>
                            </li>
                            )}
                        </>
                        }
                    </ul>
                </div>
            }

            {createNewEvent.clicked && 
                <CreateActivityForm 
                activityList={activityList}
                setActivityList={setActivityList}
                cancelForm={setCreateNewEventFalse}
                activityName={createNewEvent.name}
                categoryList={categoryList}
                />
                }
        </section>
    )
}