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
    const [activityClicked, setActivityClicked] = useState("");

    const onCreateClick = ()=>{
        setCreateNewEvent({...createNewEvent, clicked: true});
    }

    const setCreateNewEventFalse = ()=>{
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
                                    if(e.target.value.trim()){
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
                        {createNewEvent.name.toUpperCase() && !activityList.find(a => a.name === createNewEvent.name) &&
                            <li className={styles.createList}>
                                    <div className={styles.createDiv}>
                                        <div className={styles.name}>{createNewEvent.name}</div>
                                        <button type="button" onClick={onCreateClick}>Create</button>
                                    </div>
                            </li>
                        }
                        {!createNewEvent.clicked && 
                        <>
                            <li className={styles.colName}><div className={styles.name}>Name</div><div>Date Created</div></li>
                            {activityToDisplay.map(activity=>
                                <li key={activity.id} 
                                    className={styles.activity}
                                    onClick={()=>{
                                        if (activity.id == activityClicked) setActivityClicked("")
                                        else setActivityClicked(activity.id)
                                        }}>
                                    <div className={styles.activitySummary}>
                                        <div className={styles.name}>{activity.name}</div>
                                        <div>{activity.date_created}</div>
                                    </div>
                                    {activityClicked === activity.id &&
                                        <>
                                            <div className={styles.categoryList}>
                                               {activity.categories.map(c=>
                                                <>  
                                                    <div className={styles.categoryListItems}>
                                                        <div>{c}</div> 
                                                        <button onClick={async (e)=>{
                                                            e.stopPropagation();

                                                            const protocol = "http://"
                                                            const url = import.meta.env.VITE_BACKEND_URL
                                                            const port = import.meta.env.VITE_BACKEND_PORT
                                                            const fullPath = `${protocol}${url}:${port}`
                                                            const res = await fetch(`${fullPath}/activity/${activity.id}`, 
                                                                {
                                                                    method: "PUT",
                                                                    headers: {
                                                                        mode: "cors",
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json'
                                                                    },
                                                                    body: JSON.stringify({...activity, categories: activity.categories.filter(cat=> cat !== c)})
                                                                }
                                                            )

                                                            const index = activityList.findIndex(a => a.id === activity.id);
                                                            console.log(index);
                                                            let newActivityList = [...activityList]
                                                            newActivityList[index].categories = newActivityList[index].categories.filter(cat=>cat !== c);
                                                            setActivityList(newActivityList)
                                                        }}>REMOVE</button>
                                                    </div>
                                                </>
                                                )}
                                                <button>ADD</button> 
                                            </div>
                                            
                                        </>
                                    }

                                </li>
                            )}
                        </>
                        }
                    </ul>

                </div>
            }

            {createNewEvent.clicked && 
                <CreateActivityForm 
                    setActivityToDisplay={setActivityToDisplay}
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