import styles from "../../styles/Calendar/CreateActivity.module.css";
import { useContext, useState } from "react";
import { ActivityContext, CategoryContext } from './CalendarContext';


export default function CreateActivity({setCreateActivity, activityState, setActivityState, date}){
    const [createStatus, setCreateStatus] = useState({status: 0, message: ""});
    const {activityList, setActivityList} = useContext(ActivityContext);
    const {categoryList} = useContext(CategoryContext);
    const day = (new Date(date)).getDate();
    const createCategoryInputs = ()=>{
        const cInputs = []
        for(let i = 0; i < activityState.categories.length; i++){
            cInputs.push(
                <input 
                    type="text" 
                    list="categoryList" 
                    name="category" 
                    key={i} 
                    autoComplete='off'
                    value={activityState.categories[i]}
                    onChange={e=>{
                        const newCategories = activityState.categories
                        newCategories[i] = e.target.value
                        setActivityState({...activityState, categories: newCategories})
                    }}
                />)
        }
        return cInputs;
    }

    const submitForm = async (e)=>{
        e.preventDefault();
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        const res = await fetch(`${fullPath}/activity`, 
            {
                method: "POST",
                headers: {
                    mode: "cors",
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(activityState)
            }
        )
        const json = await res.json();
        setCreateStatus(json)

        if(json.status >= 400){
            console.log(json.message);
        }else{
            console.log(json.message);
            setActivityState({activity: "", categories: [""]});
            setActivityList([activityState.activity].concat(activityList)); // TODO: Automatically input in Event Activity?
            setCreateActivity(false);
        }
    }

    return(
        <>
        <form className={styles.formcontainer} action="" method='' onSubmit={submitForm}>
            <label htmlFor={`activity_title_${day}`}>Activity</label>
            <input 
                type="text" 
                name='title'
                id={`activity_title_${day}`} 
                value={activityState.activity} 
                onChange={e=>setActivityState({...activityState, activity: e.target.value})}
                required/>
            <label>Categories</label> {createCategoryInputs()}
            <datalist id="categoryList">
                    {categoryList.map(category=>{
                        return(<option key={category} value={category}>{category}</option>)
                    })}
            </datalist>

            <div className={styles.categorybuttons}>
                <button 
                    type="button" 
                    onClick={()=>{
                        const newCategories = activityState.categories
                        newCategories.push("")
                        setActivityState({...activityState, categories: newCategories});
                        }}>add</button>

                <button 
                    type="button" 
                    onClick={()=>{
                        const newCategories = activityState.categories;
                        newCategories.pop()
                        setActivityState({...activityState, categories: newCategories});
                }}>remove</button>
            </div>

            <div className={styles.backsubmit}>
                <button 
                    type="button" 
                    onClick={()=>{
                    setCreateActivity(false);
                }}>Back</button>
                
                <button type="submit">Submit</button>
            </div>
        </form>
        {createStatus.status >= 300 && 
            <div className={styles.message}>
                {createStatus.message}
            </div>
        }
        </>
    )
}