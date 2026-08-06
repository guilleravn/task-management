import { Link } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { SearchIcon } from '../icons/SearchIcon'
import { BellIcon } from '../icons/BellIcon'
import { Avatar } from '../ui/Avatar'
import { normalizeAvatarUrl } from '../../lib/dicebear'
import { GET_PROFILE } from '../../features/profile/graphql/queries'
import styles from './Header.module.css'

export function Header() {
  const { data } = useQuery(GET_PROFILE)
  const profile = data?.profile

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
        <BellIcon />
        <Link to="/settings" className={styles.avatarLink} aria-label="Settings">
          <Avatar
            src={normalizeAvatarUrl(profile?.avatar)}
            alt={profile?.fullName ?? 'User avatar'}
            size="small"
          />
        </Link>
      </div>
    </header>
  )
}
