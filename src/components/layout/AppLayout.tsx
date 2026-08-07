import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { MobileTabBar } from './MobileTabBar'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className={styles.frame}>
      <Sidebar isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <div className={styles.main}>
        <Header onMenuClick={() => setIsDrawerOpen(true)} />
        <MobileTabBar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
