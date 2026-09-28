'use client'

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'

function Sheet(props: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger(props: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose(props: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn('font-semibold', className)}
      {...props}
    />
  )
}

function SheetContent({
  children,
  className,
  ...props
}: SheetPrimitive.Popup.Props) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <SheetPrimitive.Viewport className="fixed inset-0 z-50 overflow-hidden">
        <SheetPrimitive.Popup
          data-slot="sheet-content"
          className={cn(
            'border-content-border fixed inset-y-0 right-0 flex h-full w-[min(88vw,24rem)] flex-col border-l bg-white shadow-xl outline-none transition-transform duration-300 data-ending-style:translate-x-full data-starting-style:translate-x-full dark:bg-zinc-950',
            className,
          )}
          {...props}
        >
          {children}
          <SheetPrimitive.Close
            aria-label="Close menu"
            className="absolute right-4 top-4 grid size-9 place-items-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X className="size-5" />
          </SheetPrimitive.Close>
        </SheetPrimitive.Popup>
      </SheetPrimitive.Viewport>
    </SheetPrimitive.Portal>
  )
}

export { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger }
