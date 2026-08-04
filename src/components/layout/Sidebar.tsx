import { NavLink } from 'react-router-dom'
import { DashboardIcon } from '../icons/DashboardIcon'
import { MyTaskIcon } from '../icons/MyTaskIcon'
import logo from '../../assets/logo.png'
import styles from './Sidebar.module.css'

interface NavItem {
  label: string
  path: string
  icon: React.ComponentType
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { label: 'My Task', path: '/my-task', icon: MyTaskIcon },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <ul className={styles.nav}>
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <li key={path}>
            <NavLink to={path} className={styles.navItem}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
