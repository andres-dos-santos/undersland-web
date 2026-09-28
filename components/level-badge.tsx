import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type LevelBadgeProps = Omit<ComponentProps<'div'>, 'children'> & {
  level: number
}

const levelBackgrounds = ['bg-emerald-200', 'bg-amber-200', 'bg-red-200']

function LevelBadge({ className, level, ...props }: LevelBadgeProps) {
  const background =
    levelBackgrounds[level - 1] ?? 'bg-zinc-100 dark:bg-zinc-900'

  return (
    <div
      className={cn(
        'relative flex h-8 w-16 min-w-16 items-center justify-center gap-2.5 border border-zinc-300 dark:border-zinc-800',
        background,
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute -left-px -top-px size-2 border-l-2 border-t-2 border-zinc-500 dark:border-white"
      />
      <span
        aria-hidden="true"
        className="absolute -right-px -top-px size-2 border-r-2 border-t-2 border-zinc-500 dark:border-white"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-zinc-500 dark:border-white"
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-zinc-500 dark:border-white"
      />
      <span className="text-xs font-medium text-zinc-700">LVL</span>
      <span className="font-mono text-lg font-medium text-zinc-700">
        {level}
      </span>
    </div>
  )
}

export { LevelBadge }
