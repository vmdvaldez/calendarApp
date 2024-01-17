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
                                        if (activity.id == activityClicked.id) setActivityClicked({...activity, id: 0})
                                        else setActivityClicked(activity)
                                        }}>
                                    <div className={styles.activitySummary}>
                                        <div className={styles.name}>{activity.name}</div>
                                        <div>{activity.date_created}</div>
                                    </div>
                                    {activityClicked.id === activity.id &&
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
                                                            const res = await fetch(`${fullPath}/activity/${activity.id}/categories/${c}`, 
                                                                {
                                                                    method: "DELETE",
                                                                    headers: {
                                                                        mode: "cors",
                                                                        Accept: 'application/json',
                                                                        'Content-Type': 'application/json'
                                                                    }
                                                                }
                                                            )

                                                            const json = await res.json();

                                                            if (json.status >= 300){
                                                                console.log(json.message);
                                                            }else{
                                                                const index = activityList.findIndex(a => a.id === activity.id);
                                                                console.log(index);
                                                                let newActivityList = [...activityList]
                                                                newActivityList[index].categories = newActivityList[index].categories.filter(cat=>cat !== c);
                                                                setActivityList(newActivityList)
                                                            }


                                                        }}>REMOVE</button>
                                                    </div>
                                                </>
                                                )}
                                                <form onSubmit={async (e)=>{
                                                        e.preventDefault();
                                                        const input = e.target.newcategory
                                                        const val = input.value.trim().toUpperCase();
                                                        if(val != "" && !categoryList.includes(val)){
                                                            input.setCustomValidity("Error: Please Enter Valid Category.");
                                                            input.reportValidity();
                                                            return
                                                        }else{
                                                            input.setCustomValidity("");
                                                        }
                                                        

                                                        const protocol = "http://"
                                                        const url = import.meta.env.VITE_BACKEND_URL
                                                        const port = import.meta.env.VITE_BACKEND_PORT
                                                        const fullPath = `${protocol}${url}:${port}`
                                                        const res = await fetch(`${fullPath}/activity/${activityClicked.id}/categories/${val}`, 
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    mode: "cors",
                                                                    Accept: 'application/json',
                                                                    'Content-Type': 'application/json'
                                                                }
                                                            }
                                                        )
                                                        const json = await res.json();
                                                        
                                                        if (json.status >= 300){
                                                            console.log(json.message);
                                                        }
                                                        else{
                                                            const index = activityList.findIndex(a=> a.id === activityClicked.id)
                                                            let newActivityList = [...activityList]
                                                            newActivityList[index].categories.push(val)
                                                            setActivityList(newActivityList)
                                                        }

                                                        e.target.reset();

                                                    }}>
                                                    <input 
                                                        type="text"
                                                        list="categoryList"
                                                        autoComplete="off"
                                                        name="newcategory"
                                                        onInput={(e)=>e.target.setCustomValidity("")}
                                                        onBlur={(e)=>{
                                                            const elem = e.target
                                                            const val = elem.value
                                                            if(val != "" && !categoryList.includes(val)){
                                                                elem.setCustomValidity("Error: Please Enter Valid Category.");
                                                                elem.reportValidity();
                                                            }
                                                        }}
                                                        onClick={(e)=>e.stopPropagation()}/>

                                                    <datalist id="categoryList">
                                                        {categoryList.map(category=>{
                                                            return(<option key={category} value={category}>{category}</option>)
                                                        })}
                                                    </datalist>    
                                                    <button type="submit" 
                                                        onClick={(e)=>e.stopPropagation()}
                                                        >ADD</button> 
                                                </form>
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