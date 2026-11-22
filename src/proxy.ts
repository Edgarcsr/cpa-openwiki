import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { hasUsers } from '@/lib/auth'

// Wiki recém-instalada (nenhum usuário): qualquer página leva ao onboarding,
// onde se cria a conta do dono. Depois disso este proxy não faz nada.
export const proxy = (request: NextRequest) => {
  if (hasUsers()) {
    return NextResponse.next()
  }
  return NextResponse.redirect(new URL('/onboarding', request.url))
}

export const config = {
  // Fora: onboarding, API (o cadastro do dono passa por /api/auth), arquivos do
  // Next e qualquer arquivo estático (com extensão).
  matcher: ['/((?!onboarding|api|_next|.*\\..*).*)'],
}
