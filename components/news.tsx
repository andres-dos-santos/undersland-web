import dayjs from 'dayjs'
import Link from 'next/link'
import type { New } from '@/types/new'

interface Props {
  news: New[]
}

export function News({ news }: Props) {
  const validNews = news.filter((item) => item?.data?.slug)

  return (
    <ul>
      {validNews.map((item) => (
        <li key={item.id}>
          <Link href={`/news/${item.data.slug}`} className="group block py-10">
            <h2 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
              {item.data.title}
            </h2>
            <p className="group-hover:text-zinc-800 mt-2 text-[13px] text-zinc-500 transition-colors dark:group-hover:text-zinc-200">
              {item.data.author?.name}
              <span className="px-2 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                •
              </span>
              {dayjs(item.created_at).format('MMM DD[,] YYYY')}
            </p>
            <p className="group-hover:text-zinc-800 mt-4 max-w-4xl text-[13px] leading-5 text-zinc-500 transition-colors dark:group-hover:text-zinc-200">
              {item.data.short_description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
