import type { ComponentProps, ReactNode } from 'react'
import Link, { type LinkProps } from 'next/link'

import { cn } from '@/lib/utils'

function Root({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn(
        'border-content-border flex h-14 w-full items-center px-10',
        className,
      )}
      {...props}
    />
  )
}

function List({ className, children, ...props }: ComponentProps<'nav'>) {
  return (
    <nav className={cn('h-10 w-full', className)} {...props}>
      <ul className="flex h-full items-center">{children}</ul>
    </nav>
  )
}

type ItemProps = Omit<ComponentProps<'li'>, 'children'> & {
  active?: boolean
  children: ReactNode
  disabled?: boolean
  href?: LinkProps['href']
}

function Item({
  active,
  children,
  className,
  disabled,
  href,
  ...props
}: ItemProps) {
  const itemClassName = cn(
    'relative flex items-center gap-2 text-sm text-zinc-400 transition-colors after:absolute after:inset-x-0 after:-bottom-2 after:h-px after:scale-x-0 after:bg-zinc-950 after:transition-transform data-[active=true]:after:scale-x-100 dark:after:bg-white',
    disabled
      ? 'cursor-not-allowed'
      : 'hover:text-zinc-900 data-[active=true]:text-zinc-900 dark:hover:text-white dark:data-[active=true]:text-white',
    'dark:text-zinc-300/60',
  )

  return (
    <li
      aria-disabled={disabled || undefined}
      className={cn(
        'flex h-5 items-center px-10 first:pl-0 last:pr-0 [&+li]:border-l [&+li]:border-content-border',
        className,
      )}
      {...props}
    >
      {disabled || !href ? (
        <span className={itemClassName}>{children}</span>
      ) : (
        <Link href={href} data-active={active} className={itemClassName}>
          {children}
        </Link>
      )}
    </li>
  )
}

const Navigation = {
  Root,
  List,
  Item,
}

export { Navigation }
