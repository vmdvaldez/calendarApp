import { useContext } from "react";

import { CategoryContext } from './CalendarContext';

export default function CreateActivity({setCreateActivity, activityState, setActivityState}){
    const {categoryList} = useContext(CategoryContext);

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
        const resCat = await fetch(`${fullPath}/setactivity`, 
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
    }

    return(
        <form action="" method='' onSubmit={submitForm}>
            Activity
            <input 
                type="text" 
                name='title' 
                value={activityState.activity} 
                onChange={e=>setActivityState({...activityState, activity: e.target.value})}
                required/>
            Categories {createCategoryInputs()}
            <datalist id="categoryList">
                    {categoryList.map(category=>{
                        return(<option key={category} value={category}>{category}</option>)
                    })}
            </datalist>
            <button type="button" onClick={()=>{
                const newCategories = activityState.categories
                newCategories.push("")
                setActivityState({...activityState, categories: newCategories});
            }}>add</button>
            <button type="button" onClick={()=>{
                setCreateActivity(false);
            }}>Back</button>
            <button type="submit">Submit</button>
        </form>
    )
}