import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next') || '/account'
  const origin = requestUrl.origin

  console.log('[auth/callback] params:', { code: !!code, token_hash: !!token_hash, type, next })

  const supabase = await createClient()

  // ── OAuth code exchange (Google, Facebook, Magic Link PKCE) ────────────
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[auth/callback] exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/login?error=unauthorized`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  // ── Magic Link / OTP implicit flow (token_hash in URL) ─────────────────
  if (token_hash) {
    const otpType = type === 'recovery' ? 'recovery' : 'email'
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: otpType as 'email' | 'recovery',
    })
    if (error) {
      console.error('[auth/callback] verifyOtp error:', error.message, { type })
      return NextResponse.redirect(`${origin}/login?error=unauthorized`)
    }
    return NextResponse.redirect(`${origin}${next}`)
  }

  // ── No params — redirect home ──────────────────────────────────────────
  return NextResponse.redirect(`${origin}${next}`)
}
