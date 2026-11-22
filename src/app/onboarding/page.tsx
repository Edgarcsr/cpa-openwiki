import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'

import { buttonVariants } from '@/components/ui/button'
import { hasUsers } from '@/lib/auth'
import { cn } from '@/lib/utils'

// Só existe enquanto não há nenhum usuário; depois disso, volta para o login.
const SetupGuard = async () => {
  await connection()
  if (hasUsers()) {
    redirect('/sign-in')
  }
  return null
}

export default function OnboardingPage() {
  return (
    <main className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black text-white">
      <Image
        src="/banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent"
      />

      <Image
        src="/openwiki-logo.svg"
        alt="OpenWiki"
        width={1545}
        height={222}
        className="absolute top-8 left-6 z-10 h-4 w-auto brightness-0 invert sm:left-12 lg:left-20"
      />

      <div className="relative z-10 px-6 pb-12 sm:px-12 sm:pb-16 lg:px-20">
        <h1 className="mb-3 max-w-2xl text-lg font-medium">
          Bem-vindo à sua wiki.
        </h1>
        <p className="mb-6 max-w-md text-sm leading-relaxed text-white/70">
          Uma enciclopédia aberta e feita em comunidade. Conte a história das
          pessoas, dos lugares e dos momentos que importam, do seu jeito, em
          qualquer idioma.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/onboarding/admin"
            className={cn(
              buttonVariants({ size: 'default' }),
              'min-w-48 cursor-default justify-between rounded-md bg-white text-black hover:bg-white/90'
            )}
          >
            Começar
            <ArrowRightIcon />
          </Link>
          <Link
            href="/"
            className="cursor-default text-sm text-white/70 transition-colors hover:text-white"
          >
            Saiba mais
          </Link>
        </div>
      </div>
      <Suspense fallback={null}>
        <SetupGuard />
      </Suspense>
    </main>
  )
}
