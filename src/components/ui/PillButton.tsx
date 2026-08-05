import type { ReactNode } from 'react'
import styles from './PillButton.module.css'

interface PillButtonProps {
  icon: ReactNode
  label: string
}

export function PillButton({ icon, label }: PillButtonProps) {
  return (
    <span className={styles.pill}>
      {icon}
      <span>{label}</span>
    </span>
  )
}
