import { useQuery } from '@apollo/client/react'
import { Avatar } from '../../../components/ui/Avatar'
import { normalizeAvatarUrl } from '../../../lib/dicebear'
import { GET_PROFILE } from '../graphql/queries'
import { USER_TYPE_LABELS } from '../enums'
import styles from './ProfileCard.module.css'

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function ProfileCard() {
  const { data, loading, error } = useQuery(GET_PROFILE)

  if (loading) return <p className={styles.message}>Loading profile...</p>
  if (error || !data) return <p className={styles.message}>Could not load your profile.</p>

  const { profile } = data

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Avatar src={normalizeAvatarUrl(profile.avatar)} alt={profile.fullName} size="large" />
        <div>
          <h2 className={styles.name}>{profile.fullName}</h2>
          <p className={styles.email}>{profile.email}</p>
        </div>
      </div>

      <dl className={styles.details}>
        <div className={styles.detailRow}>
          <dt className={styles.detailLabel}>Type</dt>
          <dd className={styles.detailValue}>{USER_TYPE_LABELS[profile.type]}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.detailLabel}>Created At</dt>
          <dd className={styles.detailValue}>{formatDateTime(profile.createdAt)}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.detailLabel}>Updated At</dt>
          <dd className={styles.detailValue}>{formatDateTime(profile.updatedAt)}</dd>
        </div>
      </dl>
    </div>
  )
}
