import { ArticleGlobe } from '@/components/article-globe'
import { PageShell } from '@/components/page-shell'

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PageShell>{children}</PageShell>
      <ArticleGlobe />
    </>
  )
}
