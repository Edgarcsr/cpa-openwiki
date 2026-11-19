import Image from 'next/image'

import type { ArticleMetadata } from '@/lib/article'

export const Infobox = ({
  title,
  image,
  rows,
}: {
  title: string
  image: ArticleMetadata['image']
  rows: ArticleMetadata['infobox']
}) => (
  <aside className="bg-muted/50 mb-4 w-full overflow-hidden rounded-md border text-sm md:float-right md:mb-4 md:ml-4 md:w-72">
    <Image
      src={image.src}
      alt={image.alt}
      className="mx-auto"
      width={400}
      height={400}
    />
    <div className="p-4">
      <h2 className="mb-2 text-center font-medium">{title}</h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </aside>
)
