import { NextResponse } from 'next/server'

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const SESSION_COOKIE = 'understand-session'
const sessionCookieDomain =
  process.env.SESSION_COOKIE_DOMAIN ??
  (process.env.NODE_ENV === 'production' ? '.undersland.com' : undefined)

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie')

  try {
    await fetch(new URL('/sign-out', apiUrl), {
      method: 'POST',
      cache: 'no-store',
      headers: cookie ? { cookie } : undefined,
    })
  } catch {
    // The local session must still be cleared if the API is unavailable.
  }

  const response = NextResponse.redirect(new URL('/login', request.url), {
    status: 303,
  })

  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain: sessionCookieDomain,
    path: '/',
    maxAge: 0,
  })

  return response
}
