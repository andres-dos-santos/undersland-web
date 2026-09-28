import { HugeiconsIcon } from '@hugeicons/react'
import { SearchIcon } from '@hugeicons/core-free-icons'
import { cookies } from 'next/headers'

import { News } from '@/components/news'
import { NewsModel } from '@/model/news'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'

export default async function HomeContent() {
  const sessionCookie = (await cookies()).get('understand-session')?.value
  const news = sessionCookie ? await NewsModel.getAll(sessionCookie) : []
  const selectedTab: 'News' | 'Books' = 'News'

  return (
    <div className="mx-auto max-w-3xl pt-20 sm:pt-32 px-5 sm:px-0">
      <div>
        <h1 className="font-semibold text-4xl -tracking-wider">
          A living library for english learners
        </h1>
      </div>

      <section className="h-20 flex items-end justify-between gap-5 sm:gap-0 w-full mt-10 pb-2.5">
        <nav className="flex items-center gap-4 sm:gap-10 h-10 w-full">
          <Link
            href="/books"
            data-active={selectedTab === 'News'}
            className="dark:data-[active=true]:text-white data-[active=true]:text-zinc-900 text-zinc-400 hover:text-zinc-900 text-sm dark:text-zinc-300/60 dark:hover:text-white"
          >
            <p>News</p>
          </Link>

          <p className="text-zinc-400 text-sm dark:text-zinc-300/60">|</p>

          <div
            data-active={selectedTab === 'Books'}
            className="text-zinc-400 flex items-center gap-2 text-sm cursor-not-allowed"
          >
            <p>Books</p>
            <Badge className="bg-orange-500">Coming soon</Badge>
          </div>
        </nav>

        <form
          action=""
          className="flex items-center gap-2.5 sm:gap-5 group h-10"
        >
          <input
            type="text"
            className="outline-none w-full h-full text-right placeholder:text-zinc-400 text-sm dark:placeholder:text-zinc-300/60"
            placeholder="Search"
          />
          <HugeiconsIcon
            icon={SearchIcon}
            color="currentColor"
            strokeWidth={1.5}
            className="size-6 text-zinc-500 group-focus-within:text-zinc-950 dark:group-focus-within:text-white"
          />
        </form>
      </section>

      <News news={news} />
    </div>
  )
}
