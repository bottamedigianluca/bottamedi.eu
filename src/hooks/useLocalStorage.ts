import { useState, useEffect, useCallback } from 'react'
import { handleError, safeJsonParse } from '../utils/helpers'

// Basic localStorage hook
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? safeJsonParse(item, initialValue) : initialValue
    } catch (error) {
      handleError(error, `useLocalStorage get ${key}`)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      handleError(error, `useLocalStorage set ${key}`)
    }
  }, [key, storedValue])

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      handleError(error, `useLocalStorage remove ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Advanced localStorage hook with expiration
export const useLocalStorageWithExpiry = <T>(
  key: string,
  initialValue: T,
  ttl: number = 86400000 // 24 hours in milliseconds
): [T, (value: T | ((val: T) => T)) => void, () => void, boolean] => {
  const [isExpired, setIsExpired] = useState(false)

  // Get initial value with expiry check
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const data = safeJsonParse(item, null)
      if (!data || typeof data !== 'object' || !data.hasOwnProperty('value') || !data.hasOwnProperty('timestamp')) {
        return initialValue
      }

      const now = new Date().getTime()
      if (now - data.timestamp > ttl) {
        // Data expired, remove it
        window.localStorage.removeItem(key)
        setIsExpired(true)
        return initialValue
      }

      return data.value
    } catch (error) {
      handleError(error, `useLocalStorageWithExpiry get ${key}`)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      setIsExpired(false)
      
      if (typeof window !== 'undefined') {
        const data = {
          value: valueToStore,
          timestamp: new Date().getTime()
        }
        window.localStorage.setItem(key, JSON.stringify(data))
      }
    } catch (error) {
      handleError(error, `useLocalStorageWithExpiry set ${key}`)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      setIsExpired(false)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      handleError(error, `useLocalStorageWithExpiry remove ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, isExpired]
}

// Hook for managing multiple localStorage items
export const useMultipleLocalStorage = <T extends Record<string, any>>(
  keys: (keyof T)[],
  initialValues: T
): [T, (key: keyof T, value: T[keyof T]) => void, (key: keyof T) => void, () => void] => {
  const [values, setValues] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValues
    }

    const result = { ...initialValues }
    keys.forEach(key => {
      try {
        const item = window.localStorage.getItem(String(key))
        if (item) {
          result[key] = safeJsonParse(item, initialValues[key])
        }
      } catch (error) {
        handleError(error, `useMultipleLocalStorage get ${String(key)}`)
      }
    })
    return result
  })

  const setValue = useCallback((key: keyof T, value: T[keyof T]) => {
    try {
      setValues(prev => ({ ...prev, [key]: value }))
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(String(key), JSON.stringify(value))
      }
    } catch (error) {
      handleError(error, `useMultipleLocalStorage set ${String(key)}`)
    }
  }, [])

  const removeValue = useCallback((key: keyof T) => {
    try {
      setValues(prev => ({ ...prev, [key]: initialValues[key] }))
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(String(key))
      }
    } catch (error) {
      handleError(error, `useMultipleLocalStorage remove ${String(key)}`)
    }
  }, [initialValues])

  const clearAll = useCallback(() => {
    try {
      setValues(initialValues)
      if (typeof window !== 'undefined') {
        keys.forEach(key => {
          window.localStorage.removeItem(String(key))
        })
      }
    } catch (error) {
      handleError(error, 'useMultipleLocalStorage clearAll')
    }
  }, [keys, initialValues])

  return [values, setValue, removeValue, clearAll]
}

// Hook for localStorage with validation
export const useValidatedLocalStorage = <T>(
  key: string,
  initialValue: T,
  validator: (value: any) => value is T
): [T, (value: T | ((val: T) => T)) => void, () => void, string | null] => {
  const [error, setError] = useState<string | null>(null)

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const parsed = safeJsonParse(item, null)
      if (validator(parsed)) {
        setError(null)
        return parsed
      } else {
        setError('Invalid data format in localStorage')
        return initialValue
      }
    } catch (error) {
      setError('Failed to parse localStorage data')
      handleError(error, `useValidatedLocalStorage get ${key}`)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      if (!validator(valueToStore)) {
        setError('Invalid value provided')
        return
      }

      setStoredValue(valueToStore)
      setError(null)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      setError('Failed to save to localStorage')
      handleError(error, `useValidatedLocalStorage set ${key}`)
    }
  }, [key, storedValue, validator])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      setError(null)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      setError('Failed to remove from localStorage')
      handleError(error, `useValidatedLocalStorage remove ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, error]
}

// Hook for localStorage with sync across tabs
export const useSyncedLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? safeJsonParse(item, initialValue) : initialValue
    } catch (error) {
      handleError(error, `useSyncedLocalStorage get ${key}`)
      return initialValue
    }
  })

  // Listen for storage events to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = safeJsonParse(e.newValue, initialValue)
          setStoredValue(newValue)
        } catch (error) {
          handleError(error, `useSyncedLocalStorage sync ${key}`)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      handleError(error, `useSyncedLocalStorage set ${key}`)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      handleError(error, `useSyncedLocalStorage remove ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

// Hook for localStorage with compression (for large data)
export const useCompressedLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] => {
  const compress = (data: string): string => {
    // Simple compression - in production you might want to use a proper compression library
    return btoa(data)
  }

  const decompress = (data: string): string => {
    try {
      return atob(data)
    } catch {
      return data // Return original if decompression fails
    }
  }

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue

      const decompressed = decompress(item)
      return safeJsonParse(decompressed, initialValue)
    } catch (error) {
      handleError(error, `useCompressedLocalStorage get ${key}`)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        const compressed = compress(JSON.stringify(valueToStore))
        window.localStorage.setItem(key, compressed)
      }
    } catch (error) {
      handleError(error, `useCompressedLocalStorage set ${key}`)
    }
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      handleError(error, `useCompressedLocalStorage remove ${key}`)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage