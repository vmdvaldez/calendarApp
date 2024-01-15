import styles from './App.module.css';
import Calendar from './components/Calendar/Calendar'
import NavBar from './components/NavBar';

import { Outlet } from 'react-router';

function App() {

  return (
    <div className={styles.appcontainer}>
      <NavBar />
      <Outlet />
    </div>
  )
}

export default App
