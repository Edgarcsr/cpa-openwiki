import { readdir } from 'node:fs/promises'
import path from 'node:path'

import type { COBEOptions } from 'cobe'
import { LanguagesIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ComponentType } from 'react'

import { Infobox } from '@/components/infobox'
import { Button } from '@/components/ui/button'
import { Globe } from '@/components/ui/globe'
import { Separator } from '@/components/ui/separator'
import type { ArticleMetadata } from '@/lib/article'

const ARTICLE_GLOBE_CONFIG: Partial<COBEOptions> = {
  theta: 0.5,
  markers: [],
}

const CONTENT_DIR = path.join(process.cwd(), 'src/content/pt')

interface ArticleModule {
  default: ComponentType
  metadata: ArticleMetadata
}

const loadArticle = async (slug: string): Promise<ArticleModule> => {
  try {
    return (await import(`@/content/pt/${slug}.mdx`)) as ArticleModule
  } catch {
    notFound()
  }
}

export const generateStaticParams = async () => {
  const files = await readdir(CONTENT_DIR)
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({ slug: file.replace(/\.mdx$/u, '') }))
}

export const generateMetadata = async ({
  params,
}: PageProps<'/article/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const { metadata } = await loadArticle(slug)
  return { title: metadata.title }
}

export default async function ArticlePage({
  params,
}: PageProps<'/article/[slug]'>) {
  const { slug } = await params
  const { default: Content, metadata } = await loadArticle(slug)

  return (
    <div>
      <main className="m-auto max-w-240 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg">{metadata.title}</h1>
          <div>
            <Button variant="ghost" size="default">
              <LanguagesIcon />
              Linguagem
            </Button>
          </div>
        </div>
        <Separator className="my-3" />
        <Infobox
          title={metadata.title}
          image={metadata.image}
          rows={metadata.infobox}
        />
        <Content />
      </main>
      <Globe
        config={ARTICLE_GLOBE_CONFIG}
        speed={0.0005}
        className="fixed inset-auto right-[calc(-0.51*var(--globe))] bottom-[calc(-0.39*var(--globe))] hidden w-(--globe) max-w-none opacity-40 [--globe:min(41rem,calc(100vw-60rem))] xl:block"
      />
    </div>
  )
}
