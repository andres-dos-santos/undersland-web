import Link from 'next/link'

import { Heading } from '@/components/heading'
import { cn } from '@/lib/utils'

export interface UpdatedNewsItem {
  slug: string
  title: string
}

interface UpdatedNewsProps {
  className?: string
  currentPostSlug?: string
  posts: UpdatedNewsItem[]
}

export function UpdatedNews({
  className,
  currentPostSlug,
  posts,
}: UpdatedNewsProps) {
  return (
    <section className={cn('min-h-0 overflow-y-auto px-10 pt-14', className)}>
      <Heading.Light>UPDATED NEWS [ {posts.length} ]</Heading.Light>

      <nav aria-label="Updated news" className="mt-20">
        <ul className="flex flex-col gap-7">
          {posts.map((post, index) => {
            const isCurrentPost = post.slug === currentPostSlug

            return (
              <li key={post.slug}>
                <Link
                  aria-current={isCurrentPost ? 'page' : undefined}
                  className="group grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-5"
                  href={`/news/${post.slug}`}
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums',
                      isCurrentPost
                        ? 'text-orange-500'
                        : 'text-zinc-400 transition-colors group-hover:text-orange-500',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'truncate text-xs font-medium leading-5 transition-colors',
                      isCurrentPost
                        ? 'text-zinc-950 dark:text-white'
                        : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100',
                    )}
                  >
                    {post.title}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}
