import { useState } from "react";

export default function CreateActivity({setCreateActivity, categoryList}){
    const [numCategoryInputs, setNumCategoryInputs] = useState(1);

    const createCategoryInputs = ()=>{
        const cInputs = []
        for(let i = 0; i < numCategoryInputs; i++){
            cInputs.push(<input type="text" list="categoryList" 
                    name="category" key={i} autoComplete='off'/>)
        }
        return cInputs;
    }

    return(
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
            }}>Back</button>
            <button type="submit">Submit</button>
        </form>
    )
}