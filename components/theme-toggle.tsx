'use client'

import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'

const themes: { label: string; value: Theme }[] = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
]

function getSavedTheme(): Theme {
  const theme = localStorage.getItem('theme')

  return theme === 'light' || theme === 'dark' ? theme : 'system'
}

function applyTheme(theme: Theme) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)

  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
}

interface Props {
  variant?: 'icon' | 'text'
}

export function ThemeToggle({ variant: _variant = 'icon' }: Props) {
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const savedTheme = getSavedTheme()
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    setTheme(savedTheme)
    applyTheme(savedTheme)

    const handleSystemThemeChange = () => {
      if (getSavedTheme() === 'system') applyTheme('system')
    }
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'theme') return

      const nextTheme = getSavedTheme()
      setTheme(nextTheme)
      applyTheme(nextTheme)
    }

    media.addEventListener('change', handleSystemThemeChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      media.removeEventListener('change', handleSystemThemeChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  function selectTheme(nextTheme: Theme) {
    localStorage.setItem('theme', nextTheme)
    applyTheme(nextTheme)
    setTheme(nextTheme)
  }

  return (
    <fieldset
      aria-label="Theme"
      className="flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900"
    >
      {themes.map((option) => {
        const isSelected = theme === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => selectTheme(option.value)}
            aria-pressed={isSelected}
            className="rounded-md px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 aria-pressed:bg-white aria-pressed:text-zinc-950 aria-pressed:shadow-sm dark:text-zinc-400 dark:hover:text-white dark:aria-pressed:bg-zinc-800 dark:aria-pressed:text-white"
          >
            {option.label}
          </button>
        )
      })}
    </fieldset>
  )
}
