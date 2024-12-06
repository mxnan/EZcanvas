import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'
  const code = searchParams.get('code')

  // Create URL for redirection
  const redirectTo = request.nextUrl.clone()
  redirectTo.pathname = next
  redirectTo.searchParams.delete('token_hash')
  redirectTo.searchParams.delete('type')
  redirectTo.searchParams.delete('code')

  if (!token_hash || !type) {
    redirectTo.pathname = '/error'
    return NextResponse.redirect(redirectTo)
  }
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
      ...(code ? { code } : {}), // Include code if present for PKCE flow
    })

    if (error) {
      throw error
    }

    // Clear 'next' param on successful verification
    redirectTo.searchParams.delete('next')
    return NextResponse.redirect(redirectTo)
  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error('Auth confirmation error:', error)
    
    // Redirect to error page with generic message
    redirectTo.pathname = '/error'
    redirectTo.searchParams.set('message', 'Authentication failed')
    return NextResponse.redirect(redirectTo)
  }
}