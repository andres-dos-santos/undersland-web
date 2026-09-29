import { type NextRequest, NextResponse } from 'next/server'

function decodeBase64Url(value: string) {
  return Uint8Array.from(
    atob(value.replace(/-/g, '+').replace(/_/g, '/')),
    (c) => c.charCodeAt(0),
  )
}

async function hasValidSession(request: NextRequest) {
  const secret = process.env.SESSION_SECRET
  const session = request.cookies.get('understand-session')?.value

  if (!secret || !session) return false

  const [payload, signature] = session.split('.')
  if (!payload || !signature) return false

  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const validSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      decodeBase64Url(signature),
      new TextEncoder().encode(payload),
    )
    const sessionData = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payload)),
    ) as { exp?: number }

    return (
      validSignature &&
      typeof sessionData.exp === 'number' &&
      sessionData.exp > Date.now() / 1000
    )
  } catch {
    return false
  }
}

export async function proxy(request: NextRequest) {
  const authenticated = await hasValidSession(request)
  const { pathname } = request.nextUrl
  const isUnprotectedRoute = ['/login', '/create', '/verification'].includes(
    pathname,
  )

  if (!authenticated && !isUnprotectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (authenticated && isUnprotectedRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
}
