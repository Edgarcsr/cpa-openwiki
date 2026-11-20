import { PenIcon } from 'lucide-react'

import { openwikiConfig } from '#content/openwiki.config'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

// Abre o editor do GitHub direto no mdx do artigo. Quem não tem permissão de
// escrita no repo é levado a criar um fork e abrir um PR.
const getEditUrl = (slug: string) => {
  const { url, branch, contentDir } = openwikiConfig.repo
  const file = `articles/${slug}/index.mdx`
  const path = contentDir ? `${contentDir}/${file}` : file
  return `${url}/edit/${branch}/${path}`
}

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
        <a
          href={getEditUrl(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'ghost', size: 'default' }))}
        >
          <PenIcon />
          Editar
        </a>
        {/* <Button variant="ghost" size="default">
          <LanguagesIcon />
          Linguagem
        </Button> */}
      </div>
    </div>
    <Separator className="my-3" />
  </>
)
