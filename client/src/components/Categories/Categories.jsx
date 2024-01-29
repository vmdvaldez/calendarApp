import { useOutletContext } from "react-router-dom"
import styles from "../../styles/Categories/Categories.module.css"
import { useState } from "react";

export default function Categories(){
    const {categoryList, setCategoryList} = useOutletContext();
    const [categoryToDisplay, setCategoryToDisplay] = useState([...categoryList])
    const [createNewCategory, setCreateNewCategory] = useState({name: "", clicked: false});
    const [categoryClicked, setCategoryClicked] = useState({id:0});


    const createCategory = async ()=>{
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        const res = await fetch(`${fullPath}/categories`, 
            {
                method: "POST",
                headers: {
                    mode: "cors",
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({category: createNewCategory.name.trim().toUpperCase()}) 
            }
        )

        const json = await res.json();

        console.log(json);

        if (json.status >= 300){
            console.log(json.message);
        }else{
            const newCategory = {
                id: json.id,
                name: createNewCategory.name.trim().toUpperCase(),
                date_created: json.date_created
            }
            setCategoryList([newCategory, ...categoryList])
            setCategoryToDisplay([newCategory, ...categoryToDisplay])
        }      
    }

    const deleteCategory = async (e)=>{
        e.stopPropagation();

        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const fullPath = `${protocol}${url}:${port}`
        const res = await fetch(`${fullPath}/categories/${categoryClicked.id}`, 
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

            const newCategoryList = [...categoryList]
            let index = newCategoryList.findIndex(c=>c.id === categoryClicked.id)
            newCategoryList.splice(index, 1)

            const newCategoryToDisplay = [...categoryToDisplay]
            index = newCategoryToDisplay.findIndex(c=>c.id === categoryClicked.id)
            newCategoryToDisplay.splice(index, 1)

            setCategoryList(newCategoryList)
            setCategoryToDisplay(newCategoryToDisplay)
        }     
    }

    return(
        <section className={styles.categories}>
                <div className={styles.categoriesContainer}>

                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            value={createNewCategory.name}
                            onChange={(e)=>{
                                if(e.target.value.trim()){
                                    const newCategoryDisplay = categoryList.filter(c=> c.name.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()))
                                    setCategoryToDisplay(newCategoryDisplay)
                                }else{
                                    setCategoryToDisplay([...categoryList])
                                }
                                setCreateNewCategory({...createNewCategory, name: e.target.value.trim()})
                            }}
                        />
                    </div>

                    <ul className={styles.categoryList}>
                        {createNewCategory.name && !categoryList.find(c=> c.name.toLowerCase() === createNewCategory.name.toLowerCase())
                            &&
                            <li className={styles.createList}>
                                <div className={styles.createDiv}>
                                    <div className={styles.name}>{createNewCategory.name}</div>
                                    <button type="button" 
                                        onClick={createCategory}>Create</button>
                                </div>
                            </li>
                        }
                        {!createNewCategory.clicked && 
                            <>
                            <li className={styles.colName}><div className={styles.name}>Name</div><div>Date Created</div></li>
                            {categoryToDisplay.map(category=>
                                <li 
                                    key={category.id}
                                    className={styles.category}
                                    onClick={()=>{
                                        if(category.id === categoryClicked.id) setCategoryClicked({...category, id:0})
                                        else setCategoryClicked(category)
                                    }}
                                    >
                                    <div className={styles.categorySummary}>
                                        <div className={styles.name}>{category.name}</div>
                                        <div>{category.date_created}</div>
                                    </div>


                                    {categoryClicked.id == category.id &&
                                        <button
                                            onClick={deleteCategory}>
                                            DELETE
                                        </button>
                                    }


                                </li>

                            )}
                            </>
                        }
                    </ul>
                </div>
        </section>
    )
}