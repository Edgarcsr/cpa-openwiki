import Image from 'next/image'
import Link from 'next/link'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getArticle } from '@/lib/article'
import { ARTICLE_CATEGORIES } from '@/lib/article-categories'

const ARTICLE_PREFIX = '/article/'
const SLUG_PATTERN = /^[a-z0-9-]+$/u

const getSlug = (href?: string) => {
  const slug = href?.startsWith(ARTICLE_PREFIX)
    ? href.slice(ARTICLE_PREFIX.length)
    : undefined
  return slug && SLUG_PATTERN.test(slug) ? slug : undefined
}

// Link dentro do texto de um artigo. Se o destino existe, o hover mostra o
// resumo real; se não, vira um "link vermelho" que leva ao formulário de
// criação (como na Wikipedia).
export const ArticleLink = async ({
  href,
  children,
}: {
  href?: string
  children?: React.ReactNode
}) => {
  const slug = getSlug(href)

  if (!slug) {
    return (
      <a
        href={href}
        className="text-foreground underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )
  }

  const article = await getArticle(slug)

  if (!article) {
    return (
      <HoverCard>
        <HoverCardTrigger
          render={
            <Link
              href={`/create?slug=${slug}`}
              className="text-foreground cursor-default hover:underline"
            />
          }
        >
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-72 gap-0 overflow-hidden p-0">
          <div className="flex flex-col gap-1 p-3">
            <span className="text-muted-foreground text-xs">
              Página não criada
            </span>
            <span className="text-foreground text-sm leading-snug font-semibold">
              {children}
            </span>
            <span className="text-muted-foreground text-xs leading-relaxed">
              Esta página ainda não existe. Clique para criar.
            </span>
          </div>
        </HoverCardContent>
      </HoverCard>
    )
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <Link
            href={`/article/${slug}`}
            className="text-foreground cursor-default hover:underline"
          />
        }
      >
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-72 gap-0 overflow-hidden p-0">
        {article.image && (
          <Image
            src={article.image.src}
            alt={article.image.alt}
            width={article.image.width}
            height={article.image.height}
            unoptimized
            sizes="320px"
            className="h-28 w-full object-cover object-top"
          />
        )}
        <div className="flex flex-col gap-1 p-3">
          <span className="text-muted-foreground text-xs">
            {ARTICLE_CATEGORIES[article.category]}
          </span>
          <span className="text-foreground text-sm leading-snug font-semibold">
            {article.title}
          </span>
          <span className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
            {article.summary}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
