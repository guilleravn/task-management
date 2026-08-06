import { useEffect, useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@apollo/client/react'
import { SearchIcon } from '../icons/SearchIcon'
import { BellIcon } from '../icons/BellIcon'
import { Avatar } from '../ui/Avatar'
import { normalizeAvatarUrl } from '../../lib/dicebear'
import { GET_PROFILE } from '../../features/profile/graphql/queries'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import styles from './Header.module.css'

export function Header() {
  const { data } = useQuery(GET_PROFILE)
  const profile = data?.profile

  const searchId = useId()
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(searchParams.get('q') ?? '')
  const debouncedValue = useDebouncedValue(inputValue, 300)

  useEffect(() => {
    setSearchParams(
      (params) => {
        if (debouncedValue) {
          params.set('q', debouncedValue)
        } else {
          params.delete('q')
        }
        return params
      },
      { replace: true },
    )
  }, [debouncedValue, setSearchParams])

  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <SearchIcon />
        <label htmlFor={searchId} className={styles.visuallyHidden}>
          Search
        </label>
        <input
          id={searchId}
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
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
