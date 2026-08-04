import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left} />
      <div className={styles.right} />
    </header>
  )
}
