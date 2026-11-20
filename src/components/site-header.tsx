import { SearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { openwikiConfig } from '#content/openwiki.config'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { Separator } from './ui/separator'

const REPO_URL = openwikiConfig.repo.url

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
)

export const SiteHeader = ({ overlay = false }: { overlay?: boolean }) => (
  <header
    className={cn('border-b', overlay && 'border-transparent text-white')}
  >
    <div className="m-auto flex max-w-240 items-center justify-between px-8 py-3">
      <Link href="/" className="cursor-default">
        <Image
          src="/openwiki-logo.svg"
          alt={openwikiConfig.name}
          width={1545}
          height={222}
          priority
          className={cn(
            'h-3.5 w-auto',
            overlay ? 'brightness-0 invert' : 'dark:invert'
          )}
        />
      </Link>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className={cn(
            'flex w-48 justify-start',
            overlay
              ? 'bg-white/15 text-white backdrop-blur-sm hover:bg-white/25 hover:text-white dark:hover:bg-white/25'
              : 'bg-muted hover:bg-muted/30'
          )}
        >
          <SearchIcon />
          Buscar
        </Button>
        <Separator
          orientation="vertical"
          className={cn(
            'h-4 data-vertical:self-center',
            overlay && 'bg-white/30'
          )}
        />
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Repositório do ${openwikiConfig.name} no GitHub`}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon' }),
            'cursor-default',
            overlay &&
              'text-white hover:bg-white/25 hover:text-white dark:hover:bg-white/25'
          )}
        >
          <GithubIcon />
        </a>
      </div>
    </div>
  </header>
)
