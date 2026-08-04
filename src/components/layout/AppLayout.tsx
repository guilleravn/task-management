import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import styles from './AppLayout.module.css'
import { Header } from './Header'

export function AppLayout() {
  return (
    <div className={styles.frame}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}