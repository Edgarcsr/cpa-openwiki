import type { MDXComponents } from 'mdx/types'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  h2: ({ children }) => (
    <>
      <h2 className="text-md mt-5">{children}</h2>
      <Separator className="my-2" />
    </>
  ),
  p: ({ children }) => (
    <p className="text-muted-foreground mb-2 text-justify text-sm">
      {children}
    </p>
  ),
  // Trocar por next/link quando os artigos referenciados existirem.
  // Por enquanto renderiza igual ao antigo <span>, sem link real (evita 404).
  a: ({ children }) => (
    // <span className="text-foreground decoration-muted-foreground/30 hover:decoration-foreground cursor-default underline">
    <HoverCard>
      <HoverCardTrigger>
        <span className="text-foreground cursor-default hover:underline">
          {children}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="text-foreground text-sm font-semibold">Artigo</div>
        <div className="text-muted-foreground text-xs">
          Conteúdo do artigo em breve.
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
  ...components,
})
