import { cookies } from 'next/headers'
import Link from 'next/link'
import { getCurrentUser } from '@/model/user'
import { ThemeToggle } from './theme-toggle'
import { Logo } from './logo'

export async function Header() {
  const sessionCookie = (await cookies()).get('understand-session')?.value
  const user = sessionCookie ? await getCurrentUser(sessionCookie) : null

  return (
    <header className="flex h-14 sm:h-20 border-zinc-200 dark:border-zinc-800 w-full shrink-0 items-center justify-between pr-5 sm:pr-8 pl-2.5 sm:pl-5">
      <Logo />
      <nav className="flex items-center gap-5">
        {user && (
          <Link
            href="/profile"
            aria-label={`Open ${user.name}'s profile`}
            title="Profile"
            className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-zinc-200 text-xs font-medium text-zinc-700 ring-1 ring-zinc-950/10 transition hover:ring-zinc-950/30 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/15 dark:hover:ring-white/40"
          >
            {user.picture ? (
              // biome-ignore lint/performance/noImgElement: The API can return profile images from different providers.
              <img
                src={user.picture}
                alt={user.name}
                className="size-full object-cover"
              />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </Link>
        )}
      </nav>
    </header>
  )
}
