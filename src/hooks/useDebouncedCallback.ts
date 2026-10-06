import { useEffect, useRef } from 'react'

// Returns a function that runs `callback` only after `delayMs` have passed without another call.
// A pending call is cancelled on unmount.
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return function debounced(...args: Args) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => callback(...args), delayMs)
  }
}
