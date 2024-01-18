import { useState} from "react";
import styles from "../../styles/Activities/Activities.module.css";
import { useOutletContext } from "react-router-dom";

import CreateActivityForm from './CreateActivityForm';

export default function Activities(){
    const {
            activityList, setActivityList,
            categoryList, setCategoryList } = useOutletContext();
    const [activityToDisplay, setActivityToDisplay] = useState([...activityList])
    const [createNewActivity, setCreateNewActivity] = useState({name: "", clicked: false});
    const [activityClicked, setActivityClicked] = useState({id:0});

    const onCreateClick = ()=>{
        setCreateNewActivity({...createNewActivity, clicked: true});
    }

    const setCreateNewActivityFalse = ()=>{
        setCreateNewActivity({name: "", clicked: false});
    }

    return(
        <section className={styles.activities}>
            {!createNewActivity.clicked &&
                <div className={styles.activitiescontainer}>
                    <div className={styles.searchBar}>
                        <input 
                            type="text"
                            value={createNewActivity.name}
                            onChange={(e)=>{
                                if(e.target.value.trim()){
                                    const newActivityDisplay = activityList.filter(activity=> activity.name.toLowerCase().includes(e.target.value.toLowerCase()))
                                    setActivityToDisplay(newActivityDisplay)
                                }
                                else{
                                    setActivityToDisplay([...activityList]);
                                }
                                setCreateNewActivity({...createNewActivity, name: e.target.value.trim()});
                            }}></input>
                    </div>

                    <ul className={styles.activityList}>
                        {createNewActivity.name && !activityList.find(a => a.name.toLowerCase() === createNewActivity.name.toLowerCase()) &&
                            <li className={styles.createList}>
                                    <div className={styles.createDiv}>
                                        <div className={styles.name}>{createNewActivity.name}</div>
                                        <button type="button" onClick={onCreateClick}>Create</button>
                                    </div>
                            </li>
                        }
                        {!createNewActivity.clicked && 
                        <>
                            <li className={styles.colName}><div className={styles.name}>Name</div><div>Date Created</div></li>
                            {activityToDisplay.map(activity=>
                                <li key={activity.id} 
                                    className={styles.activity}
                                    onClick={()=>{
                                        if (activity.id == activityClicked.id) setActivityClicked({...activity, id: 0})
                                        else setActivityClicked(activity)}}>
                                    <div className={styles.activitySummary}>
                                        <div className={styles.name}>{activity.name}</div>
                                        <div>{activity.date_created}</div>
                                    </div>
                                    {activityClicked.id === activity.id &&
                                        <>
                                            <div className={styles.categoryList}>
                                               {activity.categories.map(c=>
                                                    <div className={styles.categoryListItems} key={c}>
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
                                                )}
                                                <form onSubmit={async (e)=>{
                                                        e.preventDefault();
                                                        const input = e.target.newcategory
                                                        const val = input.value.trim().toUpperCase();
                                                        if(!categoryList.map(c=>c.name).includes(val)){
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
                                                            const val = elem.value.trim().toUpperCase()
                                                            if(val != "" && !categoryList.map(c=>c.name).includes(val)){
                                                                elem.setCustomValidity("Error: Please Enter Valid Category.");
                                                                elem.reportValidity();
                                                            }
                                                        }}
                                                        onClick={(e)=>e.stopPropagation()}/>

                                                    <datalist id="categoryList">
                                                        {categoryList.map(category=>{
                                                            return(<option key={category.id} value={category.name}>{category.name}</option>)
                                                        })}
                                                    </datalist>    
                                                    <button type="submit" 
                                                        onClick={(e)=>e.stopPropagation()}
                                                        >ADD Category</button> 
                                                </form>
                                                <button 
                                                    type="button"
                                                    onClick={async (e)=>{
                                                        e.stopPropagation();
                                                        const protocol = "http://"
                                                        const url = import.meta.env.VITE_BACKEND_URL
                                                        const port = import.meta.env.VITE_BACKEND_PORT
                                                        const fullPath = `${protocol}${url}:${port}`
                                                        const res = await fetch(`${fullPath}/activity/${activity.id}`, 
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

                                                        console.log(json);

                                                        if (json.status >= 300){
                                                            console.log(json.message);
                                                        }else{
                                                            let newActivityList = [...activityList]
                                                            const index = newActivityList.findIndex(a => a.id === activity.id);
                                                            newActivityList.splice(index, 1);

                                                            let newActivityDisplay = [...activityToDisplay]
                                                            const idx2 = newActivityDisplay.findIndex(a=>a.id === activity.id);
                                                            newActivityDisplay.splice(idx2, 1);

                                                            setActivityList(newActivityList);
                                                            setActivityToDisplay(newActivityDisplay);
                                                        }
                                                    }}>Delete Activity</button>
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

            {createNewActivity.clicked && 
                <CreateActivityForm 
                    setActivityToDisplay={setActivityToDisplay}
                    activityList={activityList}
                    setActivityList={setActivityList}
                    cancelForm={setCreateNewActivityFalse}
                    activityName={createNewActivity.name}
                    categoryList={categoryList}
                />
                }
        </section>
    )
}