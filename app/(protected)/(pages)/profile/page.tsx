import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/model/user'
import { Heading } from '@/components/heading'
import { CopySessionTokenButton } from '@/components/copy-session-token-button'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function ProfilePage() {
  const sessionCookie = (await cookies()).get('understand-session')?.value
  const user = sessionCookie ? await getCurrentUser(sessionCookie) : null

  if (!user) notFound()

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pt-20 sm:px-0 sm:pt-32">
      <div className="flex items-center gap-5">
        <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-zinc-200 text-2xl font-medium text-zinc-700 ring-1 ring-zinc-950/10 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/15">
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
        </div>
        <h1 className="font-title text-4xl -tracking-wide">{user.name}</h1>
      </div>

      <div className="mt-20">
        <Heading.Light>SETTINGS</Heading.Light>
        <div className="divide-content-border border-content-border mt-5 divide-y border-y">
          <div className="flex min-h-16 items-center justify-between gap-5 py-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
              Theme
            </span>
            <ThemeToggle variant="text" />
          </div>

          {process.env.NODE_ENV === 'development' && sessionCookie && (
            <div className="flex min-h-16 items-center justify-between gap-5 py-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
                Session token
              </span>
              <CopySessionTokenButton
                sessionToken={sessionCookie}
                variant="text"
              />
            </div>
          )}

          <div className="flex min-h-16 items-center justify-between gap-5 py-3">
            <span className="text-sm text-zinc-500 dark:text-zinc-500 font-medium">
              Account
            </span>
            <form action="/api/sign-out" method="post">
              <button
                type="submit"
                className="whitespace-nowrap text-xs font-medium text-red-600 transition-colors hover:text-red-700 hover:underline focus-visible:outline-none focus-visible:underline dark:text-red-400 dark:hover:text-red-300"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
