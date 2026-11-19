import type { COBEOptions } from 'cobe'

import { Footer } from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { Globe } from '@/components/ui/globe'

const ARTICLE_GLOBE_CONFIG: Partial<COBEOptions> = {
  theta: 0.5,
  markers: [],
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <SiteHeader />
      <main className="m-auto max-w-240 p-8">{children}</main>
      <Footer />
      <Globe
        config={ARTICLE_GLOBE_CONFIG}
        speed={0.0005}
        className="fixed inset-auto right-[calc(-0.51*var(--globe))] bottom-[calc(-0.39*var(--globe))] hidden w-(--globe) max-w-none opacity-40 [--globe:min(41rem,calc(100vw-60rem))] xl:block"
      />
    </div>
  )
}
