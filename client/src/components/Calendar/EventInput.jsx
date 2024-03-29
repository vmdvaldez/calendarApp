import { useContext, useState } from 'react';
import styles from '../../styles/Calendar/EventInput.module.css';

import CreateActivity from "./CreateActivity";
import CreateEvent from './CreateEvent';
import { ActivityContext, CategoryContext } from './CalendarContext';

export default function EventInput({date, eventList, setEventList, displayRight}){
    const {activityList} = useContext(ActivityContext);
    const {categoryList} = useContext(CategoryContext);


    const [createActivity, setCreateActivity] = useState(false);
    const [eventFormStates, setEventFormStates] = useState({
        title: "",
        start: "00:00",
        end: "23:59",
        activity: ""
    })
    const [activityFormStates, setActivityFormStates] = useState({
        activity: "",
        categories: [""]
    })


    const clearEventStates = ()=>{
        setEventFormStates({
            title: "",
            start: "00:00",
            end: "23:59",
            activity: ""
        })
    }
    // ON submit for create activity return change state to createEvent
    // On submit reset Create Activity inputs

    // TODO: SAVE CREATE EVENT STATE WHEN CREATING ACTIVITY
    // SEPARATE EACH CREATION EVENT TO DIFFERENT COMPONENTS

    return(
        <div 
            className={displayRight ? styles.modalRight : styles.modalLeft} 
            onClick={(e)=>{e.stopPropagation()}}>
            {!createActivity ? 
                <CreateEvent
                    eventList={eventList}
                    setEventList={setEventList}
                    date={date}
                    activityList={activityList}
                    setCreateActivity={setCreateActivity}
                    eventStates={eventFormStates}
                    setEventStates={setEventFormStates}
                    clearEventStates={clearEventStates}
                /> :  
                
                <CreateActivity 
                    date={date}
                    setCreateActivity={setCreateActivity}
                    categoryList={categoryList}
                    activityState={activityFormStates}
                    setActivityState={setActivityFormStates}
                />
            }



        </div>

    )
}