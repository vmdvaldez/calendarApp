import { useState } from 'react';
import styles from '../styles/EventInput.module.css';

export default function EventInput({activityList, categoryList}){
    const [createEvent, setCreateEvent] = useState(true);
    const [createActivity, setCreateActivity] = useState(false);
    const [numCategoryInputs, setNumCategoryInputs] = useState(1);

    const createCategoryInputs = ()=>{
        const cInputs = []
        for(let i = 0; i < numCategoryInputs; i++){
            cInputs.push(<input type="text" list="categoryList" 
                    name="category" key={i} autoComplete='off'/>)
        }
        return cInputs;
    }

    console.log(categoryList);

    // ON submit for create activity return change state to createEvent
    // On submit reset Create Activity inputs

    // TODO: SAVE CREATE EVENT STATE WHEN CREATING ACTIVITY
    // SEPARATE EACH CREATION EVENT TO DIFFERENT COMPONENTS

    return(
        <div className={styles.modal} onClick={(e)=>{e.stopPropagation()}}>
            {createEvent && 
                <form action="" method=''>
                    Title<input type="text" name='title' required></input>
                    Start<input type='time' name='start_time'></input>
                    End<input type='time' name='end_time'></input>

                    Activity
                    <input type="text" 
                        name="activity" 
                        list="activityList" 
                        autoComplete='off'
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
                            setCreateEvent(false)
                            setCreateActivity(true)
                        }}
                    >add</button>
                    
                    <datalist id="activityList">
                        {activityList.map(activity=>{
                            return(<option key={activity} value={activity}>{activity}</option>)
                        })}
                    </datalist>
                    <button type="submit">Submit</button>
                </form>
            }

            {createActivity && 
                <form action="" method=''>
                Activity<input type="text" name='title' required></input>
                Categories {createCategoryInputs()}
                <datalist id="categoryList">
                        {categoryList.map(category=>{
                            return(<option key={category} value={category}>{category}</option>)
                        })}
                </datalist>
                <button type="button" onClick={()=>{
                    setNumCategoryInputs(numCategoryInputs + 1);
                }}>add</button>
                <button type="button" onClick={()=>{
                    setCreateActivity(false);
                    setCreateEvent(true);
                }}>Back</button>
                <button type="submit">Submit</button>
            </form>
            }
        </div>

    )
}