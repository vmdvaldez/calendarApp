import styles from '../styles/NavBar.module.css';

export default function NavBar(){
    return(
        <nav className={styles.navbar}>
            <div className={styles.navbarexpand}>EXPAND</div>
            <ul>
            <li className={styles.navItems}>Tracker</li>
            <li className={styles.navItems}>Activities</li>
            <li className={styles.navItems}>Categories</li>
            </ul>
        </nav>
    )
}