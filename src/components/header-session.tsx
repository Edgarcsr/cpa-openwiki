'use client'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const OVERLAY_CLASSES =
  'text-white hover:bg-white/25 hover:text-white dark:hover:bg-white/25'

// No celular a sidebar vira uma gaveta, aberta por este botão. No desktop o
// botão de recolher fica dentro da própria sidebar.
export const HeaderSidebarTrigger = ({ overlay }: { overlay: boolean }) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <SidebarTrigger
          aria-label="Menu"
          className={cn(
            '-ml-2 cursor-default md:hidden',
            overlay && OVERLAY_CLASSES
          )}
        />
      }
    />
    <TooltipContent side="bottom">Menu</TooltipContent>
  </Tooltip>
)

// "Entrar" para visitantes (quem está logado usa a sidebar).
export const HeaderSignIn = ({ overlay }: { overlay: boolean }) => (
  <>
    <Separator
      orientation="vertical"
      className={cn('h-4 data-vertical:self-center', overlay && 'bg-white/30')}
    />
    <Link
      href="/sign-in"
      className={cn(
        buttonVariants({ variant: 'ghost' }),
        'cursor-default',
        overlay && OVERLAY_CLASSES
      )}
    >
      Entrar
    </Link>
  </>
)
