import { useState } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  src: string
  alt: string
  size?: 'small' | 'medium' | 'large'
}

const FALLBACK_AVATAR = 'https://api.dicebear.com/10.x/bottts/svg?seed=fallback'

const SIZE_PX = {
  small: 40,
  medium: 64,
  large: 128,
}

export function Avatar({ src, alt, size = 'medium' }: AvatarProps) {
  // Remembering which src failed (rather than a boolean) means a new src is retried
  // automatically, without resetting state during render.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const showFallback = !src || failedSrc === src

  return (
    <img
      src={showFallback ? FALLBACK_AVATAR : src}
      alt={alt}
      width={SIZE_PX[size]}
      height={SIZE_PX[size]}
      className={styles.avatar}
      onError={() => setFailedSrc(src)}
    />
  )
}
