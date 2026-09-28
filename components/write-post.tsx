'use client'

import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  Copy01Icon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'

const NEW_POST_URL =
  'https://github.com/andres-dos-santos/UnderStand/issues/new'

function createPostPrompt(sourceUrl: string) {
  return `Create an UnderStand post from the source article below.

Source article: ${sourceUrl}

## Instructions

- Read the source article and preserve its essential facts and context.
- Write in English and summarize the article instead of copying it.
- Create three versions of the same story for different English levels.
- Level 1 should use simple vocabulary and short, direct sentences.
- Level 2 should add detail and use moderately complex language.
- Level 3 should provide a nuanced summary with advanced vocabulary.
- Do not invent information that is not supported by the source.
- Return one valid TypeScript object matching the structure below.
- Fill every field. Generate a unique UUID for _id and a lowercase kebab-case slug.
- Use the source publication date for created_at when available; otherwise use the current date in ISO 8601 format.
- The html array must contain exactly three HTML strings in this order: beginner, intermediate, advanced.
- Wrap paragraphs in <p> tags. You may use <strong> and <em> for meaningful emphasis.
- Escape quotes correctly so the result can be pasted into a TypeScript array without syntax errors.
- Put the original article in links and use its headline or publication as the link text.
- Return only the object literal, without an explanation or Markdown code fence.

{
  _id: '[generated UUID]',
  title: '[short descriptive English title]',
  created_at: '[ISO 8601 publication date]',
  short_description: '[one or two sentence English summary]',
  html: [
    '<p>[concise beginner English summary]</p>',
    '<p>[concise intermediate English summary]</p>',
    '<p>[concise advanced English summary]</p>',
  ],
  slug: '[lowercase-kebab-case-title]',
  links: [
    {
      link: '${sourceUrl}',
      text: '[original article headline or publication]',
    },
  ],
  author: {
    name: '[original article author]',
  },
}
`
}

const instructions = [
  {
    title: 'Add the article link',
    description:
      'Paste a news article URL, then copy the prompt generated from it.',
  },
  {
    title: 'Review and submit',
    description:
      'Copy the AI response, review it, and paste the complete post object below.',
  },
]

export function WritePost() {
  const [sourceUrl, setSourceUrl] = useState('')
  const [generatedPost, setGeneratedPost] = useState('')
  const [copied, setCopied] = useState(false)
  const copyResetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isValidSourceUrl = (() => {
    try {
      const url = new URL(sourceUrl)
      return url.protocol === 'http:' || url.protocol === 'https:'
    } catch {
      return false
    }
  })()
  const postTitle =
    generatedPost.match(/title\s*:\s*['"]([^'"\n]+)['"]/i)?.[1]?.trim() ?? ''
  const submissionUrl = `${NEW_POST_URL}?${new URLSearchParams({
    title: postTitle ? `[POST] ${postTitle}` : '[POST] ',
    body: `\`\`\`ts\n${generatedPost}\n\`\`\``,
    labels: 'post-submission',
  }).toString()}`

  useEffect(() => {
    return () => {
      if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
    }
  }, [])

  async function copyTemplate() {
    if (!isValidSourceUrl) return

    const prompt = createPostPrompt(sourceUrl)
    const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`

    window.open(chatGptUrl, '_blank', 'noopener,noreferrer')
    await navigator.clipboard.writeText(prompt)
    setCopied(true)

    if (copyResetTimeout.current) clearTimeout(copyResetTimeout.current)
    copyResetTimeout.current = setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      {/* <DialogTrigger
        render={
          <button
            className="cursor-pointer -tracking-wide text-sm text-zinc-500 transition-colors hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
            type="button"
          />
        }
      >
        Write
      </DialogTrigger> */}

      <DialogContent>
        <div className="px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="flex items-start justify-between gap-8">
            <div>
              <DialogTitle className="text-2xl tracking-tight text-zinc-950 dark:text-zinc-50">
                Write for UnderStand
              </DialogTitle>
              <DialogDescription className="mt-2 max-w-xl text-sm leading-6">
                Help English learners explore one subject at the level that
                feels right for them.
              </DialogDescription>
            </div>

            <DialogClose
              aria-label="Close"
              className="grid size-8 shrink-0 place-items-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
            </DialogClose>
          </div>

          <ol className="mt-8">
            {instructions.map((instruction, index) => (
              <li
                className="border-content-border border-b py-6 first:pt-0 last:border-b-0 last:pb-0"
                key={instruction.title}
              >
                <span className="font-mono text-xs text-zinc-400 dark:text-zinc-600">
                  0{index + 1}
                </span>
                <h3 className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {instruction.title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  {instruction.description}
                </p>
                {index === 0 && (
                  <div className="mt-4 space-y-2">
                    <label className="sr-only" htmlFor="source-article-url">
                      Source article URL
                    </label>
                    <input
                      className="h-8 w-full rounded-lg border border-zinc-200 bg-transparent px-2.5 text-xs text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
                      id="source-article-url"
                      onChange={(event) => {
                        setSourceUrl(event.target.value.trim())
                        setCopied(false)
                      }}
                      placeholder="https://example.com/news"
                      type="url"
                      value={sourceUrl}
                    />
                    <button
                      className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                      disabled={!isValidSourceUrl}
                      onClick={copyTemplate}
                      type="button"
                    >
                      <HugeiconsIcon
                        icon={copied ? Tick02Icon : Copy01Icon}
                        className="size-3.5"
                        strokeWidth={2}
                      />
                      <span aria-live="polite">
                        {copied
                          ? 'Copied! ChatGPT opened'
                          : 'Copy and open ChatGPT'}
                      </span>
                    </button>
                  </div>
                )}
                {index === 1 && (
                  <div className="mt-4">
                    <label className="sr-only" htmlFor="generated-post">
                      Completed post object
                    </label>
                    <textarea
                      className="min-h-36 w-full resize-y rounded-lg border border-zinc-200 bg-transparent px-3 py-2.5 font-mono text-xs leading-5 text-zinc-900 outline-none transition-colors placeholder:font-sans placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600"
                      id="generated-post"
                      onChange={(event) => setGeneratedPost(event.target.value)}
                      placeholder="Paste the completed post object from the AI here..."
                      value={generatedPost}
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="border-content-border mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              GitHub will open the filled issue for your final confirmation.
            </p>
            <a
              aria-disabled={!generatedPost.trim()}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 aria-disabled:pointer-events-none aria-disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
              href={submissionUrl}
              onClick={(event) => {
                if (!generatedPost.trim()) event.preventDefault()
              }}
              rel="noreferrer"
              target="_blank"
            >
              Submit post
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                className="size-3.5"
                strokeWidth={2}
              />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
