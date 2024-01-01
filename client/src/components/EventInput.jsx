import { useState } from 'react';
import styles from '../styles/EventInput.module.css';

import CreateActivity from "./CreateActivity";
import CreateEvent from './CreateEvent';

export default function EventInput({activityList, categoryList}){
    const [createActivity, setCreateActivity] = useState(false);


    console.log(categoryList);

    // ON submit for create activity return change state to createEvent
    // On submit reset Create Activity inputs

    // TODO: SAVE CREATE EVENT STATE WHEN CREATING ACTIVITY
    // SEPARATE EACH CREATION EVENT TO DIFFERENT COMPONENTS

    return(
        <div className={styles.modal} onClick={(e)=>{e.stopPropagation()}}>
            {!createActivity ? 
                <CreateEvent
                    activityList={activityList}
                    setCreateActivity={setCreateActivity}
                /> :  
                
                <CreateActivity 
                    setCreateActivity={setCreateActivity}
                    categoryList={categoryList}
                />
            }



        </div>

    )
}