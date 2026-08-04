import { SearchIcon } from '../icons/SearchIcon'
import { Avatar } from '../ui/Avatar'
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
      <div className={styles.actions}>
        <Avatar
          src="https://api.dicebear.com/10.x/pixel-art/svg?seed=John"
          alt="User Avatar"
          size="small"
        />
      </div>
    </header>
  )
}
