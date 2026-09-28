import { cookies } from 'next/headers'
import Link from 'next/link'
import { getCurrentUser } from '@/model/user'
import { Logo } from './logo'
import { MobileTopics } from './mobile-topics'

export async function Header() {
  const sessionCookie = (await cookies()).get('understand-session')?.value
  const user = sessionCookie ? await getCurrentUser(sessionCookie) : null

  return (
    <header className="border-content-border flex h-10 w-full shrink-0 items-center justify-between border-b-0 pl-2.5 pr-5 sm:h-14 sm:pl-5 sm:pr-8 lg:border-b">
      <Logo className="size-10" />

      <div className="flex h-7 px-10 items-center justify-center bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600">
        <p className="text-[11px] font-semibold tracking-wider text-zinc-900 uppercase">
          This version is in the testing phase and is subject to errors.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <MobileTopics />
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
      </div>
    </header>
  )
}
