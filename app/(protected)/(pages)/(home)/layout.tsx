import { HugeiconsIcon } from '@hugeicons/react'
import { SearchIcon } from '@hugeicons/core-free-icons'
import { cookies } from 'next/headers'

import { News } from '@/components/news'
import { NewsModel } from '@/model/news'
import { Navigation } from '@/components/level-navigation'
import type { ReactNode } from 'react'

const contentTabs = [
  { label: 'News', href: '/' },
  // { label: 'Books', href: '/books', disabled: true },
] as const

interface HomeProps {
  children: ReactNode
}

export default async function Home({ children }: HomeProps) {
  const sessionCookie = (await cookies()).get('understand-session')?.value
  const news = sessionCookie ? await NewsModel.getAll(sessionCookie) : []
  const selectedTab = 'News'

  return (
    <div className="grid min-h-[calc(100dvh_-_56px)] mx-auto max-w-6xl content-start grid-cols-1 sm:min-h-[calc(100dvh_-_80px)] lg:h-[calc(100vh_-_80px)] lg:grid-cols-11 lg:content-normal">
      <main className="flex flex-col border-content-border min-w-0 lg:col-span-6 lg:overflow-y-auto lg:border-r">
        <div className="flex h-24 items-start px-5 pt-5 sm:px-10 lg:h-30 lg:pt-14">
          <h1 className="text-2xl font-semibold -tracking-wide sm:text-3xl">
            A living library for english learners
          </h1>
        </div>

        <Navigation.Root className="my-10 h-14 shrink-0 justify-end border-b-0 px-5 sm:justify-start sm:px-10">
          <Navigation.List
            className="hidden lg:block"
            aria-label="Content type"
          >
            {contentTabs.map((tab) => (
              <Navigation.Item
                key={tab.label}
                href={tab.href}
                active={selectedTab === tab.label}
              >
                {tab.label}
              </Navigation.Item>
            ))}
          </Navigation.List>
        </Navigation.Root>

        <div className="[&_a]:px-5 [&_a]:py-7 sm:[&_a]:px-10 sm:[&_a]:py-10">
          <News news={news} />
        </div>

        <form
          action=""
          className="group bg-zinc-50 px-5 rounded-full mx-auto mt-auto flex h-14 max-h-14 border border-content-border mb-10 max-w-[16rem] flex-1 items-center gap-2.5 sm:gap-5"
        >
          <HugeiconsIcon
            icon={SearchIcon}
            color="currentColor"
            strokeWidth={1.5}
            className="size-6 text-zinc-500 group-focus-within:text-zinc-950 dark:group-focus-within:text-white"
          />
          <input
            type="text"
            className="outline-none w-full h-full placeholder:text-zinc-400 text-sm dark:placeholder:text-zinc-300/60"
            placeholder="Search"
          />
        </form>
      </main>

      <div className="lg:col-span-5 w-full">{children}</div>
    </div>
  )
}
