import { useState } from "react";

export default function CreateActivity({
    setCreateActivity, 
    categoryList,
    activityState,
    setActivityState}){

        const createCategoryInputs = ()=>{
        const cInputs = []
        for(let i = 0; i < activityState.numCatInput; i++){
            const key = `category${i}`
            cInputs.push(
                <input 
                    type="text" 
                    list="categoryList" 
                    name="category" 
                    key={i} 
                    autoComplete='off'
                    value={key in activityState ? activityState[`category${i}`] : ""}
                    onChange={e=>setActivityState({...activityState, [`category${i}`]: e.target.value})}
                />)
        }
        return cInputs;
    }

    return(
        <form action="" method=''>
            Activity
            <input 
                type="text" 
                name='title' 
                value={activityState.title} 
                onChange={e=>setActivityState({...activityState, title: e.target.value})}
                required/>
            Categories {createCategoryInputs()}
            <datalist id="categoryList">
                    {categoryList.map(category=>{
                        return(<option key={category} value={category}>{category}</option>)
                    })}
            </datalist>
            <button type="button" onClick={()=>{
                setActivityState({...activityState, numCatInput: activityState.numCatInput+1});
            }}>add</button>
            <button type="button" onClick={()=>{
                setCreateActivity(false);
            }}>Back</button>
            <button type="submit">Submit</button>
        </form>
    )
}