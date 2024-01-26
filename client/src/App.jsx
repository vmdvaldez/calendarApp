import styles from './App.module.css';
import NavBar from './components/NavBar';

import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';

function App() {
  const [activityList, setActivityList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(()=>{
    async function getActivities(){
        const protocol = "http://"
        const url = import.meta.env.VITE_BACKEND_URL
        const port = import.meta.env.VITE_BACKEND_PORT
        const res = await fetch(`${protocol}${url}:${port}/activity`, {
            method: "GET",
            headers:{
                mode: "cors"
            }
        })
        const json =  await res.json();

        return json
    }
    getActivities().then(activities => {
      setActivityList(activities.map(activity=>({
        id: activity.uid,
        name: activity.name,
        date_created: activity.date_created,
        categories: activity.categories
      })));
    });

},[categoryList])

  useEffect(()=>{
      async function getCategories(){
          const protocol = "http://"
          const url = import.meta.env.VITE_BACKEND_URL
          const port = import.meta.env.VITE_BACKEND_PORT
          const res = await fetch(`${protocol}${url}:${port}/categories`, {
              method: "GET",
              headers:{
                  mode: "cors"
              }
          })
          const json =  await res.json();
          return json
      }

      getCategories().then(categories => {
          setCategoryList(categories.map(category=>({
            id: category.id,
            name: category.name,
            date_created: category.date_created
          })));
      });
  },[]);

  return (
    <div className={styles.appcontainer}>
      <NavBar />
      <Outlet context={{
        activityList, setActivityList,
        categoryList, setCategoryList
        }}/>
    </div>
  )
}

export default App
