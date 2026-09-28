import { ArrowUpRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'

import { Navigation } from '@/components/level-navigation'
import { cn } from '@/lib/utils'

const footerItems = ['Terms & Conditions', 'Support', 'Meet the creator']
const levels = ['B1', 'C1'] as const
export const englishTopics = [
  'Verb to be',
  'Subject pronouns',
  'Articles: a, an and the',
  'Plural nouns',
  'Possessive adjectives',
  'This, that, these and those',
  'There is and there are',
  'Simple present',
  'Adverbs of frequency',
  'Present continuous',
  'Simple past',
  'Future: will and going to',
]

export function getTopicSlug(topic: string) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface Props {
  className?: string
}

export function Topics({ className }: Props) {
  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
      <Navigation.Root className="shrink-0 px-5 sm:px-10">
        <Navigation.List aria-label="English level">
          {levels.map((level) => (
            <Navigation.Item
              key={level}
              href={`/books?level=${level.toLowerCase()}`}
              active={level === 'B1'}
            >
              {level}
            </Navigation.Item>
          ))}
        </Navigation.List>
      </Navigation.Root>

      <ul className="border-content-border min-h-0 flex-1 overflow-y-auto border-b">
        {englishTopics.map((topic, index) => (
          <li
            key={topic}
            className="border-content-border border-t first:border-t-0"
          >
            <Link
              href={`/topic/${getTopicSlug(topic)}`}
              className="group flex items-center gap-4 px-5 py-3"
            >
              <span className="font-mono text-[10px] tabular-nums text-orange-500">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-xs uppercase text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white">
                {topic}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="relative mt-auto shrink-0">
        <ChevronDown className="absolute right-0.5 top-0.5 size-2.5 -rotate-[135deg]" />
        <ul className="flex w-full flex-col gap-2.5 p-5 sm:p-10">
          {footerItems.map((item) => (
            <li
              key={item}
              className="group flex w-fit cursor-pointer items-center gap-1"
            >
              <p className="text-[11px] uppercase text-zinc-400 transition-colors group-hover:text-zinc-900 dark:group-hover:text-white">
                {item}
              </p>
              <ArrowUpRight className="size-3.5 -translate-x-2 text-orange-500 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}
