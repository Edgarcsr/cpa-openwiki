import Image from 'next/image'

import { openwikiConfig } from '#content/openwiki.config'
import { Separator } from '@/components/ui/separator'

// Mesma largura do conteúdo (max-w-240) em todas as páginas.
export const Footer = () => (
  <footer className="relative z-10 mx-auto w-full max-w-240 px-8 pb-8">
    <Separator className="mb-5" />
    <div className="flex items-center gap-3">
      <Image
        src="/openwiki-logo.svg"
        alt={openwikiConfig.name}
        width={1545}
        height={222}
        className="h-3 w-auto dark:invert"
      />
      <span className="text-muted-foreground text-xs">
        {openwikiConfig.description}
      </span>
    </div>
  </footer>
)
