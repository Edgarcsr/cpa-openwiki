import type { MDXComponents } from 'mdx/types'

import { ArticleHeader } from '@/components/article-header'
import { Infobox } from '@/components/infobox'
import { Separator } from '@/components/ui/separator'

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  ArticleHeader,
  Infobox,
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
    <span className="text-foreground cursor-default hover:underline">
      {children}
    </span>
  ),
  ...components,
})
