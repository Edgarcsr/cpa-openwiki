import type { COBEOptions } from 'cobe'

import { Globe } from '@/components/ui/globe'

const ARTICLE_GLOBE_CONFIG: Partial<COBEOptions> = {
  theta: 0.5,
  markers: [],
}

// Globo decorativo no canto das páginas de artigo (ler, criar e editar).
export const ArticleGlobe = () => (
  <Globe
    config={ARTICLE_GLOBE_CONFIG}
    speed={0.0005}
    className="fixed inset-auto right-[calc(-0.51*var(--globe))] bottom-[calc(-0.39*var(--globe))] hidden w-(--globe) max-w-none opacity-40 [--globe:min(41rem,calc(100vw-60rem))] xl:block"
  />
)
