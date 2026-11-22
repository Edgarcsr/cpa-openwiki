import Image from 'next/image'
import Link from 'next/link'

import type { ArticleMetadata } from '@/lib/article'
import { ARTICLE_CATEGORIES } from '@/lib/article-categories'

export const ArticleCard = ({
  slug,
  title,
  summary,
  category,
  image,
}: ArticleMetadata & { slug: string }) => (
  <Link
    href={`/article/${slug}`}
    className="group bg-muted/30 hover:bg-muted/60 flex cursor-default flex-col overflow-hidden rounded-md border transition-colors"
  >
    <div className="bg-muted aspect-4/3 w-full overflow-hidden">
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          unoptimized
          sizes="(min-width: 640px) 224px, 100vw"
          className="h-full w-full object-cover"
        />
      )}
    </div>
    <div className="flex flex-1 flex-col gap-1 p-3">
      <span className="text-muted-foreground text-xs">
        {ARTICLE_CATEGORIES[category]}
      </span>
      <h3 className="text-sm font-medium group-hover:underline">{title}</h3>
      <p className="text-muted-foreground line-clamp-3 text-xs leading-relaxed">
        {summary}
      </p>
    </div>
  </Link>
)
