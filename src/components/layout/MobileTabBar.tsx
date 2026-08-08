import { NavLink } from 'react-router-dom'
import styles from './MobileTabBar.module.css'

const TABS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Task', path: '/my-task' },
]

export function MobileTabBar() {
  return (
    <nav className={styles.tabs}>
      {TABS.map(({ label, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
