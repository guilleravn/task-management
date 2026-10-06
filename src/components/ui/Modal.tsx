import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

interface ModalProps {
  onClose: () => void
  ariaLabel: string
  children: ReactNode
}

// Render it conditionally (`{isOpen && <Modal …/>}`): mounting moves focus in, unmounting
// restores it and resets any form state inside.
export function Modal({ onClose, ariaLabel, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialogRef.current?.focus()

    return () => {
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // React bubbles events through portals along the React tree, so without stopping
  // pointerdown here a drag that starts inside the modal reaches the dnd-kit listeners of the
  // card that rendered it (e.g. selecting text in an input would start dragging the card).
  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
