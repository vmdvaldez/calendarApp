import styles from '../styles/NavBar.module.css';
import { Link } from 'react-router-dom';

export default function NavBar(){
    return(
        <nav className={styles.navbar}>
            <div className={styles.navbarexpand}>EXPAND</div>
            <ul>
            <Link to="/calendar"><li className={styles.navItems}>Calendar</li></Link>
            <Link to="/activities"><li className={styles.navItems}>Activities</li></Link>
            <Link to="/categories"><li className={styles.navItems}>Categories</li></Link>
            <Link to="/tracker"><li className={styles.navItems}>Tracker</li></Link>
            </ul>
        </nav>
    )
}