import { NavLink } from 'react-router-dom'
import { GridIcon } from '../icons/GridIcon'
import { ListIcon } from '../icons/ListIcon'
import { SettingsIcon } from '../icons/SettingsIcon'
import logo from '../../assets/logo.png'
import styles from './Sidebar.module.css'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: GridIcon },
  { label: 'My Task', path: '/my-task', icon: ListIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <ul className={styles.nav}>
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>

          </li>
        ))}
      </ul>
    </aside>
  )
}
