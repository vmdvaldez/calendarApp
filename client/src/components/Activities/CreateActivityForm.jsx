import { useState } from 'react';
import styles from '../../styles/Activities/CreateActivityForm.module.css';

export default function CreateActivityForm({cancelForm, activityName, categoryList, activityList, setActivityList}){
    const [categoryInputs, setCategoryInputs] = useState([""]);

    function createCategoryInput(){
        const inputs = []

        for (let i = 0; i < categoryInputs.length; i++){
            inputs.push(
                <>
                <label className={styles.categoryNum}>category{i+1}</label>
                <input 
                    type="text"
                    list="categoryList"
                    key={i}
                    autoComplete='off'
                    value={categoryInputs[i]}
                    onChange={(e)=>{
                        const newCategories = [...categoryInputs]
                        newCategories[i] = e.target.value
                        setCategoryInputs(newCategories)
                    }}/>
                </>
            )
        }
        return inputs
    }

    async function formSubmit(e){
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
                body: JSON.stringify({
                    activity: activityName.trim(), 
                    categories: categoryInputs})
            }
        )
        const json = await res.json();
        if(json.status >= 400){
            console.log(json.message);
        }else{
            const activityInfo = json.activityInfo;
            console.log(json.message);
            setActivityList([{
                id: activityInfo.id, 
                name: activityName.trim(),
                date_created: activityInfo.date_created
            }].concat(activityList));
            cancelForm();
        }
    }

    return(
        <form className={styles.form} onSubmit={formSubmit}>
            <div className={styles.title}>{activityName}</div>
            {createCategoryInput()}
            <datalist id="categoryList">
                    {categoryList.map(category=>{
                        return(<option key={category} value={category}>{category}</option>)
                    })}
            </datalist>
            <button type="button" onClick={()=>{
                setCategoryInputs([...categoryInputs, ""])
            }}>ADD</button>
            <div className={styles.navButtons}>
                <button type="button" onClick={cancelForm}>Cancel</button>
                <button type="submit">Submit</button>
            </div>
        </form>
    )
}