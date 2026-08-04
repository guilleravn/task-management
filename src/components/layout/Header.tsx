import { SearchIcon } from '../icons/SearchIcon'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
        />
      </div>
      <div className={styles.actions} />
    </header>
  )
}
