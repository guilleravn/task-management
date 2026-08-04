import logo from '../../assets/logo.png'
import styles from './Sidebar.module.css'

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <img src={logo} alt="Logo" className={styles.logo} />
    </aside>
  )
}
