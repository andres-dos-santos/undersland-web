'use client'

import {
  AiTranslateIcon,
  ALargeSmall,
  ArrowDownIcon,
  ArrowLeft01FreeIcons,
  ArrowLeft02FreeIcons,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  HighlighterIcon,
  ListMinusIcon,
  ParagraphSpacingIcon,
  Settings01Icon,
  Target03FreeIcons,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Children,
  type ReactElement,
  type ReactNode,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Command } from '@/components/command'
import { Heading } from '@/components/heading'
import { LevelBadge } from '@/components/level-badge'
import { Toggle } from '@/components/toggle'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from '@/components/ui/drawer'
import { WritePost } from '@/components/write-post'
import { AudioPlayer } from './audio-player'

type ArticleMetadataProps = {
  author: string
  date: string
  title: string
}

type ArticleContentProps = {
  difficultWords: string[][]
  levels: string[]
}

type ArticleSourcesProps = {
  links: Array<{
    link: string
    text: string
  }>
}

type ArticlePostListProps = {
  posts: Array<{
    slug: string
    title: string
  }>
  currentPostSlug: string
}

type ArticleNavigationProps = {
  nextPostSlug?: string
  previousPostSlug?: string
}

type ArticleRootProps = {
  children: [
    ReactElement<ArticleMetadataProps>,
    ReactElement<ArticleContentProps>,
    ReactElement<ArticleSourcesProps>,
    ReactElement<ArticlePostListProps>,
    ReactElement<ArticleNavigationProps>,
  ]
}

type LevelTransitionPhase = 'idle' | 'covering' | 'revealing'

const LEVEL_TRANSITION_COVER_DURATION = 450
const LEVEL_TRANSITION_REVEAL_DURATION = 550

const BLOCK_ELEMENT_PATTERN =
  /<(?:article|blockquote|div|h[1-6]|ol|p|pre|section|table|ul)\b/i
const MOBILE_LEVEL_SWIPE_THRESHOLD = 64

function addParagraphs(html: string) {
  const content = html.trim()

  if (!content || BLOCK_ELEMENT_PATTERN.test(content)) {
    return content
  }

  return content
    .split(/(?:\r?\n\s*)+/)
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.trim()}</p>`)
    .join('')
}

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function highlightDifficultWords(html: string, words: string[]) {
  if (words.length === 0) return html

  const pattern = words
    .toSorted((first, second) => second.length - first.length)
    .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const difficultWordPattern = new RegExp(`\\b(${pattern})\\b`, 'gi')

  return html
    .split(/(<[^>]+>)/g)
    .map((part) =>
      part.startsWith('<')
        ? part
        : part.replace(
            difficultWordPattern,
            '<mark class="rounded-sm bg-yellow-200 px-0.5 text-inherit dark:bg-yellow-400/70">$1</mark>',
          ),
    )
    .join('')
}

function ArticleMetadata(_props: ArticleMetadataProps) {
  return null
}

function ArticleContent(_props: ArticleContentProps) {
  return null
}

function ArticleSources(_props: ArticleSourcesProps) {
  return null
}

function ArticlePostList(_props: ArticlePostListProps) {
  return null
}

function ArticleNavigation(_props: ArticleNavigationProps) {
  return null
}

function getSlotProps<Props>(children: ReactNode, index: number, name: string) {
  const child = Children.toArray(children)[index]

  if (!isValidElement<Props>(child)) {
    throw new Error(`Article.${name} must be used inside Article.Root.`)
  }

  return child.props
}

function ArticleRoot({ children }: ArticleRootProps) {
  const { author, date, title } = getSlotProps<ArticleMetadataProps>(
    children,
    0,
    'Metadata',
  )
  const { difficultWords, levels } = getSlotProps<ArticleContentProps>(
    children,
    1,
    'Content',
  )
  const { links } = getSlotProps<ArticleSourcesProps>(children, 2, 'Sources')
  const { currentPostSlug, posts } = getSlotProps<ArticlePostListProps>(
    children,
    3,
    'PostList',
  )
  const { nextPostSlug, previousPostSlug } =
    getSlotProps<ArticleNavigationProps>(children, 4, 'Navigation')
  const router = useRouter()
  const [levelIndex, setLevelIndex] = useState(0)
  const [levelTransitionPhase, setLevelTransitionPhase] =
    useState<LevelTransitionPhase>('idle')
  const [transitionLevel, setTransitionLevel] = useState(1)
  const [highlightWords, setHighlightWords] = useState(false)
  const [smallText, setSmallText] = useState(false)
  const [lineSpacing, setLineSpacing] = useState(false)
  const [focusModeOpen, setFocusModeOpen] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [postsOpen, setPostsOpen] = useState(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const levelIndexRef = useRef(0)
  const levelTransitionPhaseRef = useRef<LevelTransitionPhase>('idle')
  const levelTransitionTimers = useRef<number[]>([])

  const changeLevel = useCallback(
    (direction: 1 | -1) => {
      const nextLevel = Math.min(
        Math.max(levelIndexRef.current + direction, 0),
        levels.length - 1,
      )

      if (
        nextLevel === levelIndexRef.current ||
        levelTransitionPhaseRef.current !== 'idle'
      ) {
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        levelIndexRef.current = nextLevel
        setLevelIndex(nextLevel)
        return
      }

      levelTransitionPhaseRef.current = 'covering'
      setTransitionLevel(nextLevel + 1)
      setLevelTransitionPhase('covering')

      levelTransitionTimers.current.push(
        window.setTimeout(() => {
          levelIndexRef.current = nextLevel
          setLevelIndex(nextLevel)
          levelTransitionPhaseRef.current = 'revealing'
          setLevelTransitionPhase('revealing')

          levelTransitionTimers.current.push(
            window.setTimeout(() => {
              levelTransitionPhaseRef.current = 'idle'
              setLevelTransitionPhase('idle')
            }, LEVEL_TRANSITION_REVEAL_DURATION),
          )
        }, LEVEL_TRANSITION_COVER_DURATION),
      )
    },
    [levels.length],
  )

  const increaseLevel = useCallback(() => {
    changeLevel(1)
  }, [changeLevel])

  const decreaseLevel = useCallback(() => {
    changeLevel(-1)
  }, [changeLevel])

  useEffect(() => {
    return () => {
      for (const timer of levelTransitionTimers.current) {
        window.clearTimeout(timer)
      }
    }
  }, [])

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (
      event.touches.length !== 1 ||
      window.matchMedia('(min-width: 1024px)').matches
    ) {
      touchStart.current = null
      return
    }

    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStart.current
      touchStart.current = null

      if (!start || event.changedTouches.length !== 1) return

      const touch = event.changedTouches[0]
      const horizontalDistance = touch.clientX - start.x
      const verticalDistance = touch.clientY - start.y

      if (
        Math.abs(horizontalDistance) < MOBILE_LEVEL_SWIPE_THRESHOLD ||
        Math.abs(horizontalDistance) <= Math.abs(verticalDistance) * 1.25
      ) {
        return
      }

      if (horizontalDistance < 0) {
        increaseLevel()
      } else {
        decreaseLevel()
      }
    },
    [decreaseLevel, increaseLevel],
  )

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target

      if (
        event.repeat ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (target instanceof HTMLElement &&
          (target.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)))
      ) {
        return
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setFocusModeOpen(true)
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        decreaseLevel()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        increaseLevel()
      }

      if (event.key === 'ArrowUp' && previousPostSlug) {
        event.preventDefault()
        router.push(`/news/${previousPostSlug}`)
      }

      if (event.key === 'ArrowDown' && nextPostSlug) {
        event.preventDefault()
        router.push(`/news/${nextPostSlug}`)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [decreaseLevel, increaseLevel, nextPostSlug, previousPostSlug, router])

  return (
    <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[3.5rem_minmax(0,1fr)] overflow-hidden lg:grid-cols-10 px-2.5 lg:px-0">
      <header className="h-14 lg:grid grid-cols-10 col-span-10 w-full">
        <div className="col-span-2"></div>
        <div className="col-span-5 h-full grid grid-cols-11">
          <Link className="flex items-center col-span-3 gap-1.5" href="/">
            <HugeiconsIcon
              icon={ArrowLeft02FreeIcons}
              className="size-4"
              strokeWidth={1.5}
            />
            <p className="text-zinc-400 hover:text-zinc-900 text-[13px] dark:text-zinc-300/60 dark:hover:text-white">
              Home
            </p>
          </Link>

          <div className="flex items-center justify-center col-span-5 gap-2.5">
            <LevelBadge level={levelIndex + 1} />
            <p className="text-xs max-w-1/2 font-medium text-zinc-400 -tracking-wider line-clamp-1">
              {title}
            </p>
          </div>

          <div className="col-span-3"></div>
        </div>
        <div className="col-span-3"></div>
      </header>

      <aside className="hidden col-span-2 h-full overflow-hidden lg:block">
        <section className="p-10">
          <Heading.Light>OPTIONS</Heading.Light>

          <div className="gap-7 flex flex-col mt-10">
            <Toggle.Root id="small-text">
              <Toggle.Label
                icon={
                  <HugeiconsIcon icon={ALargeSmall} strokeWidth={1} size={20} />
                }
              >
                Small Text
              </Toggle.Label>
              <Toggle.Switch
                checked={smallText}
                onCheckedChange={setSmallText}
              />
            </Toggle.Root>

            <Toggle.Root id="line-spacing">
              <Toggle.Label
                icon={
                  <HugeiconsIcon
                    icon={ParagraphSpacingIcon}
                    strokeWidth={1}
                    size={20}
                  />
                }
              >
                Line Spacing
              </Toggle.Label>
              <Toggle.Switch
                checked={lineSpacing}
                onCheckedChange={setLineSpacing}
              />
            </Toggle.Root>

            <Toggle.Root id="show-translate">
              <Toggle.Label
                icon={
                  <HugeiconsIcon
                    icon={AiTranslateIcon}
                    strokeWidth={1}
                    size={20}
                  />
                }
              >
                Show Translate
              </Toggle.Label>
              <Toggle.Switch />
            </Toggle.Root>

            <Toggle.Root id="highlight-difficult-words">
              <Toggle.Label
                icon={
                  <HugeiconsIcon
                    icon={HighlighterIcon}
                    strokeWidth={1}
                    size={20}
                  />
                }
              >
                Highlight
              </Toggle.Label>
              <Toggle.Switch
                checked={highlightWords}
                onCheckedChange={setHighlightWords}
              />
            </Toggle.Root>
          </div>

          <Heading.Light className="mb-10 mt-14">COMMANDS</Heading.Light>

          <div className="flex flex-col gap-4">
            <Command.Root>
              <Command.Key>F</Command.Key>
              <Command.Label>Focus mode</Command.Label>
            </Command.Root>

            <Command.Root>
              <Command.Key>P</Command.Key>
              <Command.Label>Play / pause audio</Command.Label>
            </Command.Root>

            <Command.Root>
              <Command.Key>
                <HugeiconsIcon
                  icon={ArrowRightIcon}
                  size={14}
                  strokeWidth={2}
                />
              </Command.Key>
              <Command.Label>Increase level</Command.Label>
            </Command.Root>

            <Command.Root>
              <Command.Key>
                <HugeiconsIcon icon={ArrowLeftIcon} size={14} strokeWidth={2} />
              </Command.Key>
              <Command.Label>Decrease level</Command.Label>
            </Command.Root>

            <Command.Root disabled={!previousPostSlug}>
              <Command.Key>
                <HugeiconsIcon icon={ArrowUpIcon} size={14} strokeWidth={2} />
              </Command.Key>
              <Command.Label>Previous post</Command.Label>
            </Command.Root>

            <Command.Root disabled={!nextPostSlug}>
              <Command.Key>
                <HugeiconsIcon icon={ArrowDownIcon} size={14} strokeWidth={2} />
              </Command.Key>
              <Command.Label>Next post</Command.Label>
            </Command.Root>
          </div>
        </section>
      </aside>

      <div className="relative h-full min-h-0 overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 rounded-xl lg:col-span-5">
        <div
          aria-hidden="true"
          className="page-transition"
          data-phase={levelTransitionPhase}
        >
          <span className="page-transition-level text-zinc-500 dark:text-zinc-400">
            {String(transitionLevel).padStart(2, '0')}
          </span>
        </div>

        <div
          className="h-full touch-pan-y overflow-y-auto px-5 py-7 pb-36 [scrollbar-width:none] sm:px-10 sm:py-10 sm:pb-44 lg:px-16 [&::-webkit-scrollbar]:hidden"
          onTouchCancel={() => {
            touchStart.current = null
          }}
          onTouchEnd={handleTouchEnd}
          onTouchStart={handleTouchStart}
        >
          <header>
            <h1 className="text-2xl font-semibold leading-tight -tracking-wide sm:text-3xl">
              {title}
            </h1>
          </header>

          <span className="mt-2.5 block text-[11px] font-semibold tracking-widest text-zinc-400 uppercase">
            {date} by {author}
          </span>

          <article
            aria-live="polite"
            className={`prose prose-zinc mt-2.5 max-w-none text-zinc-600 dark:prose-invert prose-h2:text-lg dark:text-white ${
              smallText
                ? 'prose-p:text-xs prose-li:text-xs'
                : 'prose-p:text-sm prose-li:text-sm'
            } ${
              lineSpacing
                ? 'prose-p:leading-8 prose-li:leading-8'
                : 'prose-p:leading-6 prose-li:leading-6'
            }`}
          >
            <div
              className="mt-10"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Post HTML is supplied by the trusted API and sanitized there.
              dangerouslySetInnerHTML={{
                __html: highlightWords
                  ? highlightDifficultWords(
                      addParagraphs(levels[levelIndex] ?? ''),
                      difficultWords[levelIndex] ?? [],
                    )
                  : addParagraphs(levels[levelIndex] ?? ''),
              }}
            />
          </article>

          {links.length > 0 && (
            <footer className="mt-10 border-t border-dashed border-zinc-200 pt-10 dark:border-zinc-800">
              <ol className="space-y-2">
                {links.map((item, index) => (
                  <li className="flex items-start gap-2" key={item.link}>
                    <span className="mt-0.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-600">
                      {index + 1}
                    </span>
                    <a
                      className="text-xs text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      href={item.link}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </footer>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-40 flex min-h-28 w-full items-center justify-center px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:min-h-32 sm:px-10 sm:py-4 lg:px-16">
          <div className="flex items-center gap-2.5 rounded-2xl backdrop-blur-sm border border-zinc-200 p-2 dark:border-zinc-800 bg-background/65">
            <div className="justify-self-start">
              <AudioPlayer
                author={author}
                key={levelIndex}
                text={stripHtml(levels[levelIndex] ?? '')}
                title={title}
              />
            </div>

            <button
              aria-label="Open focus mode"
              className="group hidden sm:flex size-12 items-center justify-center justify-self-end rounded-xl border border-zinc-400 bg-white shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/20 dark:hover:bg-zinc-800"
              onClick={() => setFocusModeOpen(true)}
              type="button"
            >
              <HugeiconsIcon
                icon={Target03FreeIcons}
                strokeWidth={2}
                className="size-4 text-black dark:text-white"
              />
            </button>

            <button
              aria-label="Show posts"
              className="group flex size-12 items-center justify-center rounded-xl border border-zinc-400 bg-white shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/20 dark:hover:bg-zinc-800 lg:hidden"
              onClick={() => setPostsOpen(true)}
              type="button"
            >
              <HugeiconsIcon
                icon={ListMinusIcon}
                strokeWidth={2}
                className="size-4 text-black dark:text-white"
              />
            </button>

            <button
              aria-label="Open reading options"
              className="group flex size-12 items-center justify-center rounded-xl border border-zinc-400 bg-white shadow-sm transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/20 dark:hover:bg-zinc-800 lg:hidden"
              onClick={() => setOptionsOpen(true)}
              type="button"
            >
              <HugeiconsIcon
                icon={Settings01Icon}
                strokeWidth={2}
                className="size-4 text-black dark:text-white"
              />
            </button>
          </div>
        </div>
      </div>

      <aside className="hidden col-span-3 h-full overflow-hidden lg:block pl-10">
        <div className="mb-10 mt-14">
          <Heading.Light>UPDATED NEWS</Heading.Light>
          {/* <WritePost /> */}
        </div>

        <nav aria-label="Posts">
          <ul>
            {posts.map((post, index) => {
              const isCurrentPost = post.slug === currentPostSlug

              return (
                <li key={post.slug} className="pr-10">
                  <Link
                    aria-current={isCurrentPost ? 'page' : undefined}
                    className="group relative grid grid-cols-[2rem_1fr] gap-3 py-3 transition-colors"
                    href={`/news/${post.slug}`}
                  >
                    <span className="font-mono text-xs text-zinc-400 mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-medium text-xs leading-5 line-clamp-1 ${
                        isCurrentPost
                          ? 'text-zinc-950 dark:text-white'
                          : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100'
                      }`}
                    >
                      {post.title}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <Dialog open={focusModeOpen} onOpenChange={setFocusModeOpen}>
        <DialogContent className="max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <DialogTitle className="text-2xl leading-tight tracking-tight text-zinc-950 dark:text-zinc-50">
              {title}
            </DialogTitle>
            <article className="prose prose-zinc mt-8 max-w-none dark:prose-invert">
              <div
                // biome-ignore lint/security/noDangerouslySetInnerHtml: Post HTML is supplied by the trusted API and sanitized there.
                dangerouslySetInnerHTML={{
                  __html: addParagraphs(levels[levelIndex] ?? ''),
                }}
              />
            </article>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer
        open={postsOpen}
        onOpenChange={setPostsOpen}
        showSwipeHandle={false}
        swipeDirection="down"
      >
        <DrawerContent className="min-h-[75dvh] overflow-visible border-zinc-200 border-t bg-white shadow-[0_-16px_50px_rgba(24,24,27,0.08)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-40 before:h-40 before:bg-[linear-gradient(to_bottom,transparent,#ffffff)] before:content-[''] dark:border-zinc-800 dark:bg-[linear-gradient(to_bottom,#111113_0%,#0d0d0f_32%,#09090b_68%,#09090b_100%)] dark:shadow-none dark:before:bg-[linear-gradient(to_bottom,transparent,#111113)] lg:hidden">
          <div className="overflow-y-auto px-6 pb-8 pt-5">
            <DrawerTitle className="text-lg text-zinc-950 dark:text-zinc-50">
              Posts
            </DrawerTitle>
            <DrawerDescription className="mt-1 text-sm">
              Choose another post to read.
            </DrawerDescription>

            <nav aria-label="Posts" className="mt-5">
              <ul>
                {posts.map((post, index) => {
                  const isCurrentPost = post.slug === currentPostSlug

                  return (
                    <li key={post.slug}>
                      <Link
                        aria-current={isCurrentPost ? 'page' : undefined}
                        className="group grid grid-cols-[2rem_1fr] gap-3 border-b border-zinc-100 py-3 transition-colors last:border-b-0 dark:border-zinc-800"
                        href={`/news/${post.slug}`}
                        onClick={() => setPostsOpen(false)}
                      >
                        <span className="mt-0.5 font-mono text-xs text-zinc-400">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`text-sm font-medium leading-5 ${
                            isCurrentPost
                              ? 'text-zinc-950 dark:text-white'
                              : 'text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100'
                          }`}
                        >
                          {post.title}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer
        open={optionsOpen}
        onOpenChange={setOptionsOpen}
        showSwipeHandle={false}
        swipeDirection="down"
      >
        <DrawerContent className="min-h-[60dvh] overflow-visible border-zinc-200 border-t bg-white shadow-[0_-16px_50px_rgba(24,24,27,0.08)] before:pointer-events-none before:absolute before:inset-x-0 before:-top-40 before:h-40 before:bg-[linear-gradient(to_bottom,transparent,#ffffff)] before:content-[''] dark:border-zinc-800 dark:bg-[linear-gradient(to_bottom,#111113_0%,#0d0d0f_32%,#09090b_68%,#09090b_100%)] dark:shadow-none dark:before:bg-[linear-gradient(to_bottom,transparent,#111113)] lg:hidden">
          <div className="overflow-y-auto px-6 pb-8 pt-5">
            <DrawerTitle className="text-lg text-zinc-950 dark:text-zinc-50">
              Reading options
            </DrawerTitle>
            <DrawerDescription className="mt-1 text-sm">
              Adjust the article to make it easier to read.
            </DrawerDescription>

            <div className="mt-7 flex flex-col gap-6">
              <Toggle.Root id="mobile-small-text">
                <Toggle.Label
                  className="gap-4 text-sm"
                  icon={
                    <HugeiconsIcon
                      icon={ALargeSmall}
                      strokeWidth={1}
                      size={20}
                    />
                  }
                >
                  Small Text
                </Toggle.Label>
                <Toggle.Switch
                  checked={smallText}
                  onCheckedChange={setSmallText}
                />
              </Toggle.Root>

              <Toggle.Root id="mobile-line-spacing">
                <Toggle.Label
                  className="gap-4 text-sm"
                  icon={
                    <HugeiconsIcon
                      icon={ParagraphSpacingIcon}
                      strokeWidth={1}
                      size={20}
                    />
                  }
                >
                  Line Spacing
                </Toggle.Label>
                <Toggle.Switch
                  checked={lineSpacing}
                  onCheckedChange={setLineSpacing}
                />
              </Toggle.Root>

              <Toggle.Root id="mobile-show-translate">
                <Toggle.Label
                  className="gap-4 text-sm"
                  icon={
                    <HugeiconsIcon
                      icon={AiTranslateIcon}
                      strokeWidth={1}
                      size={20}
                    />
                  }
                >
                  Show Translate
                </Toggle.Label>
                <Toggle.Switch />
              </Toggle.Root>

              <Toggle.Root id="mobile-highlight-difficult-words">
                <Toggle.Label
                  className="gap-4 text-sm"
                  icon={
                    <HugeiconsIcon
                      icon={HighlighterIcon}
                      strokeWidth={1}
                      size={20}
                    />
                  }
                >
                  Highlight Difficult Words
                </Toggle.Label>
                <Toggle.Switch
                  checked={highlightWords}
                  onCheckedChange={setHighlightWords}
                />
              </Toggle.Root>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export {
  ArticleContent as Content,
  ArticleMetadata as Metadata,
  ArticleNavigation as Navigation,
  ArticlePostList as PostList,
  ArticleRoot as Root,
  ArticleSources as Sources,
}
