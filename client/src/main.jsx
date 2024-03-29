import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import {createBrowserRouter, RouterProvider, Navigate} from "react-router-dom"

import Calendar from './components/Calendar/Calendar.jsx'
import Activities from './components/Activities/Activities.jsx'
import Categories from './components/Categories/Categories.jsx'
import Trackers from './components/Trackers/Trackers.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Navigate to="/calendar" replace/>
      },
      {
        path: "calendar",
        element: <Calendar />
      },
      {
        path: "activities",
        element: <Activities />
      },
      {
        path: "tracker",
        element: <Trackers/>
      },
      {
        path: "categories",
        element: <Categories/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>,
)
