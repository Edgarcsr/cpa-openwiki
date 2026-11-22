import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

import { openwikiConfig } from '#content/openwiki.config'
import { HeaderSidebarTrigger, HeaderSignIn } from '@/components/header-session'
import { Button } from '@/components/ui/button'
import { getRequestSession } from '@/lib/session'
import { cn } from '@/lib/utils'

// A sessão é lida no servidor (dentro de Suspense), então o botão de menu e o
// "Entrar" já chegam certos no HTML, sem piscar.
const SessionTrigger = async ({ overlay }: { overlay: boolean }) => {
  const session = await getRequestSession()
  return session ? <HeaderSidebarTrigger overlay={overlay} /> : null
}

const SessionSignIn = async ({ overlay }: { overlay: boolean }) => {
  const session = await getRequestSession()
  return session ? null : <HeaderSignIn overlay={overlay} />
}

// Ações da conta (moderação, sair etc.) ficam na sidebar; aqui sobra a busca
// e, para visitantes, o "Entrar".
export const SiteHeader = ({ overlay = false }: { overlay?: boolean }) => (
  <header
    className={cn('border-b', overlay && 'border-transparent text-white')}
  >
    <div className="mx-auto flex max-w-240 items-center justify-between px-8 py-3">
      <div className="flex items-center gap-2">
        <Suspense fallback={null}>
          <SessionTrigger overlay={overlay} />
        </Suspense>
        {/* Com a sidebar aberta (desktop) o logo já está nela; não repete. */}
        <Link
          href="/"
          className="cursor-default md:group-has-[[data-slot=sidebar][data-state=expanded]]/sidebar-wrapper:hidden"
        >
          <Image
            src="/openwiki-logo.svg"
            alt={openwikiConfig.name}
            width={1545}
            height={222}
            priority
            className={cn(
              'h-3.5 w-auto',
              overlay ? 'brightness-0 invert' : 'dark:invert'
            )}
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className={cn(
            'flex w-48 justify-start',
            overlay
              ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white dark:hover:bg-white/25'
              : 'bg-muted hover:bg-muted/30'
          )}
        >
          <SearchIcon />
          Buscar
        </Button>
        <Suspense fallback={null}>
          <SessionSignIn overlay={overlay} />
        </Suspense>
      </div>
    </div>
  </header>
)
