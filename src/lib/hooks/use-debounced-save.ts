import { useState, useEffect, useCallback, useRef } from 'react'

export function useDebouncedSave<T>(
  value: T,
  onSave: (value: T) => Promise<void>,
  delay: number = 2000
) {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const lastSavedValue = useRef<T>(value)

  useEffect(() => {
    // Only mark as unsaved if the value has actually changed
    const hasChanged = JSON.stringify(value) !== JSON.stringify(lastSavedValue.current)
    setHasUnsavedChanges(hasChanged)
    
    if (!hasChanged) {
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsSaving(true)
      try {
        await onSave(value)
        lastSavedValue.current = value
        setHasUnsavedChanges(false)
      } catch (error) {
        // Error handling is done in the save function
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [value, onSave, delay])

  return {
    hasUnsavedChanges,
    isSaving
  }
}
