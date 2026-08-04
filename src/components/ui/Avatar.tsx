import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

const FALLBACK_AVATAR = 'https://api.dicebear.com/10.x/pixel-art/svg?seed=fallback';

export function Avatar({ src, alt, size = 'medium'}: AvatarProps) {
    const [hasError, setHasError] = useState(false);
    const [lastSrc, setLastSrc] = useState(src);

    if (src !== lastSrc) {
        setLastSrc(src);
        setHasError(false);
    }

    return (
        <img
            src={hasError ? FALLBACK_AVATAR : src}
            alt={alt}
            width={size === 'small' ? 40 : size === 'medium' ? 64 : 128}
            height={size === 'small' ? 40 : size === 'medium' ? 64 : 128}
            style={{ borderRadius: '50%' , objectFit: 'cover' }}
            onError={() => setHasError(true)}
            />
    );
}