import { PenIcon } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export const ArticleHeader = ({
  title,
  slug,
}: {
  title: string
  slug: string
}) => (
  <>
    <div className="flex items-center justify-between">
      <h1 className="text-lg">{title}</h1>
      <div>
        <Link
          href={`/article/${slug}/edit`}
          className={cn(buttonVariants({ variant: 'ghost', size: 'default' }))}
        >
          <PenIcon />
          Editar
        </Link>
        {/* <Button variant="ghost" size="default">
          <LanguagesIcon />
          Linguagem
        </Button> */}
      </div>
    </div>
    <Separator className="my-3" />
  </>
)
