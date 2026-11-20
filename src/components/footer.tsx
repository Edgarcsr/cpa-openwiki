import Image from 'next/image'

import { openwikiConfig } from '#content/openwiki.config'
import { Separator } from '@/components/ui/separator'

// const FOOTER_LINKS = [] as const

export const Footer = () => (
  <footer className="relative z-10 m-auto max-w-240 px-8 pb-8">
    <Separator className="mb-5" />
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="/openwiki-logo.svg"
          alt={openwikiConfig.name}
          width={1545}
          height={222}
          className="h-3 w-auto"
        />
        <span className="text-muted-foreground text-xs">
          {openwikiConfig.description}
        </span>
      </div>
    </div>
  </footer>
)
