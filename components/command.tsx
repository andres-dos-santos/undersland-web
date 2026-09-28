import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type RootProps = ComponentProps<'div'> & {
  disabled?: boolean
}

function Root({ className, disabled, ...props }: RootProps) {
  return (
    <div
      aria-disabled={disabled || undefined}
      className={cn(
        'flex items-center gap-4',
        disabled && 'opacity-35',
        className,
      )}
      {...props}
    />
  )
}

function Key({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'flex size-7 items-center justify-center rounded-[3px] border border-zinc-400 font-mono text-xs text-zinc-500 shadow-sm dark:border-zinc-700 dark:text-zinc-400',
        className,
      )}
      {...props}
    />
  )
}

function Label({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('text-xs', className)} {...props} />
}

const Command = {
  Root,
  Key,
  Label,
}

export { Command }
