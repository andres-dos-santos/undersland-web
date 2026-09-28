'use client'

import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { Topics } from '@/components/topics'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function MobileTopics() {
  const pathname = usePathname()

  if (pathname !== '/') return null

  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open learning menu"
        className="grid size-9 place-items-center rounded-md text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white lg:hidden"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle className="sr-only">Learning menu</SheetTitle>
        <Topics className="pt-14" />
      </SheetContent>
    </Sheet>
  )
}
