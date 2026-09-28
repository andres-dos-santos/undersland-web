import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Light({ className, ...props }: ComponentProps<'strong'>) {
  return (
    <strong
      className={cn(
        'block text-[11px] tracking-widest font-medium text-zinc-400 dark:text-zinc-400',
        className,
      )}
      {...props}
    />
  )
}

const Heading = {
  Light,
}

export { Heading }
