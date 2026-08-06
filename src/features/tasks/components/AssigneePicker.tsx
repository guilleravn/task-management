import { useQuery } from '@apollo/client/react'
import { Popover } from '../../../components/ui/Popover'
import { PillButton } from '../../../components/ui/PillButton'
import { Avatar } from '../../../components/ui/Avatar'
import { AssigneeIcon } from '../../../components/icons/AssigneeIcon'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import { GET_USERS } from '../graphql/queries'
import type { User } from '../types'
import styles from './AssigneePicker.module.css'

interface AssigneePickerProps {
  value: User | null
  onChange: (value: User) => void
}

export function AssigneePicker({ value, onChange }: AssigneePickerProps) {
  const { data, loading } = useQuery(GET_USERS)
  const users = data?.users ?? []

  const trigger = value ? (
    <PillButton
      icon={<Avatar src={normalizeAvatarUrl(value.avatar)} alt={value.fullName} size="small" />}
      label={value.fullName}
    />
  ) : (
    <PillButton icon={<AssigneeIcon />} label="Assignee" />
  )

  return (
    <Popover fullWidth trigger={trigger}>
      {(close) => (
        <>
          <p className={styles.title}>Assign To...</p>
          <ul className={styles.list}>
            {loading && <li className={styles.loading}>Loading...</li>}
            {users.map((user) => (
              <li key={user.id}>
                <button
                  type="button"
                  className={styles.option}
                  onClick={() => {
                    onChange(user)
                    close()
                  }}
                >
                  <Avatar src={normalizeAvatarUrl(user.avatar)} alt={user.fullName} size="small" />
                  {user.fullName}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </Popover>
  )
}
