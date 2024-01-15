import styles from './App.module.css';
import Calendar from './components/Calendar/Calendar'
import NavBar from './components/NavBar';

function App() {

  return (
    <div className={styles.appcontainer}>
      <NavBar />
      <Calendar />
    </div>
  )
}

export default App
