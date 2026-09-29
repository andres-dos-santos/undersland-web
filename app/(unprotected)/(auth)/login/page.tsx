import { Logo } from '@/components/logo'

const benefits = [
  {
    title: 'AI-organized for your learning',
    description:
      'Everything is thoughtfully organized with AI to make your learning clear and focused.',
  },
  {
    title: 'Understand every new word',
    description:
      'See vocabulary in context and turn difficult passages into clear ideas.',
  },
  {
    title: 'Train your listening skills',
    description:
      'Listen as you read to connect pronunciation, meaning, and confidence.',
  },
]

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.33 2.98-7.41Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.98-.9 6.63-2.36l-3.24-2.54c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.62A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.39 13.93A6.02 6.02 0 0 1 6.07 12c0-.67.12-1.32.32-1.93V7.45H3.04A10 10 0 0 0 2 12c0 1.61.38 3.14 1.04 4.55l3.35-2.62Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.94c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.96 5.45l3.35 2.62C7.18 7.7 9.39 5.94 12 5.94Z"
      />
    </svg>
  )
}

export default function LoginPage() {
  return (
    <main className="h-dvh overflow-hidden bg-white p-0 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto grid h-full max-w-[1800px] grid-rows-[repeat(2,minmax(0,1fr))] overflow-hidden lg:grid-cols-[1.08fr_0.92fr] lg:grid-rows-1 lg:rounded-[0.5rem]">
        <section
          className="relative flex min-h-0 flex-col justify-start overflow-hidden bg-zinc-900 bg-cover bg-center px-4 py-4 text-white sm:px-9 sm:py-9 lg:justify-between lg:px-12 lg:py-12"
          style={{ backgroundImage: "url('/login.png')" }}
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950/35 via-zinc-950/10 to-zinc-950/30" />

          <div className="relative z-10 [&_span]:!text-white [&_svg]:!size-10 [&_svg]:!text-white">
            <Logo />
          </div>

          <div className="relative z-10 mt-auto max-w-2xl lg:my-auto lg:py-12">
            <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.28em] text-white/50 lg:block">
              English that stays with you
            </p>
            <h2 className="mt-3 hidden max-w-xl text-2xl font-semibold leading-tight tracking-[-0.05em] lg:block lg:text-4xl xl:text-5xl">
              Learn through the stories shaping the world.
            </h2>

            <div className="divide-y divide-white/35 border-t border-white/35 lg:mt-12">
              {benefits.map(({ title, description }, index) => (
                <article
                  key={title}
                  className="grid grid-cols-[2.75rem_1fr] gap-3 py-3 sm:grid-cols-[5rem_1fr] sm:gap-8 sm:py-5 lg:grid-cols-[6rem_1fr] lg:py-6"
                >
                  <p className="text-xl leading-none tracking-[-0.08em] text-white sm:text-3xl lg:text-4xl">
                    0{index + 1}
                  </p>
                  <div>
                    <h3 className="max-w-md text-base uppercase leading-[0.95] tracking-[-0.02em] text-white sm:text-xl lg:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-md text-[11px] leading-4 text-white/70 sm:mt-3 sm:text-[13px] sm:leading-5">
                      {description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex min-h-0 items-start justify-center bg-white px-5 py-4 transition-colors dark:bg-zinc-950 sm:px-12 sm:py-12 lg:items-center lg:px-16 xl:px-24">
          <div className="w-full max-w-sm">
            <div className="mb-5 sm:mb-10">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400 sm:mb-3 sm:text-xs">
                Welcome back
              </p>
              <h1 className="text-2xl tracking-[-0.05em] text-zinc-950 dark:text-zinc-50 sm:text-4xl">
                Continue your journey.
              </h1>
              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500 dark:text-zinc-400 sm:mt-4 sm:text-sm sm:leading-6">
                Sign in to pick up where you left off and keep every new word
                within reach.
              </p>
            </div>

            <form action="/api/sign-in" method="post" className="space-y-5">
              {/* <Field.Root id="email">
                <Field.Label>Email address</Field.Label>
                <Field.Input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </Field.Root>

              <label
                htmlFor="remember"
                className="flex w-fit cursor-pointer items-center gap-3 text-sm text-zinc-600"
              >
                <Checkbox id="remember" name="remember" />
                Keep me signed in
              </label>

              <Button
                type="submit"
                className="group h-12 w-full bg-zinc-950 text-white hover:bg-zinc-800"
              >
                Sign In
              </Button>

              <div className="flex items-center gap-4" aria-hidden="true">
                <div className="h-px flex-1 bg-zinc-200" />
                <span className="text-xs font-medium text-zinc-400">OR</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div> */}

              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/sign-up`}
                data-google-auth
                className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-300 bg-white text-sm font-medium -tracking-wider text-zinc-950 outline-none transition hover:bg-zinc-50 focus-visible:ring-4 focus-visible:ring-zinc-950/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:focus-visible:ring-white/20"
              >
                <GoogleLogo className="size-5" />
                Continue with Google
              </a>
            </form>

            {/* <p className="mt-8 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/create"
                className="font-medium text-zinc-950 underline underline-offset-4"
              >
                Create an account
              </Link>
            </p> */}
          </div>
        </section>
      </div>
    </main>
  )
}
