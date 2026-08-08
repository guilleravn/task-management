import { useSearchParams } from 'react-router-dom'

interface UseUrlParamOptions<T> {
  serialize: (value: T) => string
  deserialize: (raw: string | null) => T
}

export function useUrlParam<T>(key: string, { serialize, deserialize }: UseUrlParamOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const value = deserialize(searchParams.get(key))

  function setValue(newValue: T) {
    setSearchParams(
      (params) => {
        const raw = serialize(newValue)
        if (raw) {
          params.set(key, raw)
        } else {
          params.delete(key)
        }
        return params
      },
      { replace: true },
    )
  }

  return [value, setValue] as const
}
