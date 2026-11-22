import Markdown from 'react-markdown'
import type { Components } from 'react-markdown'

import { ArticleLink } from '@/components/article-link'
import { Separator } from '@/components/ui/separator'

// Markdown do artigo com a tipografia da wiki. HTML cru não é interpretado.
const components: Components = {
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
  ul: ({ children }) => (
    <ul className="text-muted-foreground mb-2 list-disc pl-5 text-sm">
      {children}
    </ul>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 border-l-2 pl-3 italic">{children}</blockquote>
  ),
  strong: ({ children }) => (
    <strong className="text-foreground">{children}</strong>
  ),
  a: ({ href, children }) => <ArticleLink href={href}>{children}</ArticleLink>,
}

export const ArticleBody = ({ body }: { body: string }) => (
  <Markdown components={components}>{body}</Markdown>
)
