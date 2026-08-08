import type { ReactNode } from 'react'
import styles from './PillButton.module.css'

interface PillButtonProps {
  icon: ReactNode
  label: string
}

export function PillButton({ icon, label }: PillButtonProps) {
  return (
    <span className={styles.pill}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </span>
  )
}
