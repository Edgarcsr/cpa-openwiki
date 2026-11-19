import { ArrowRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Footer } from '@/components/footer'
import { SiteHeader } from '@/components/site-header'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const FEATURED_ARTICLE = {
  href: '/article/alexandre-fernandes',
  title: 'Alexandre de Campos Fernandes',
  summary:
    'Membro ativo da C.P.A. e considerado o fundador da organização. Cursa Biologia na UFSCar e tem diploma em Biologia Marinha.',
  image: {
    src: '/alexandre-fernandes.webp',
    alt: 'Alexandre de Campos Fernandes',
  },
} as const

export default function Home() {
  return (
    <>
      <section className="relative h-112 w-full overflow-hidden text-white">
        <Image
          src="/banner.png"
          alt=""
          className="object-cover object-center"
          fill
          priority
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-black/50 via-black/10 to-black/70"
        />

        <div className="absolute inset-x-0 top-0 z-10">
          <SiteHeader overlay />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="m-auto max-w-240 px-8 pb-10">
            <h1 className="max-w-lg text-3xl font-medium tracking-tight text-balance sm:text-4xl">
              A enciclopédia aberta, feita em comunidade.
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
              Conte a história das pessoas, dos lugares e dos momentos que
              importam, do seu jeito e em qualquer idioma.
            </p>
            <Link
              href={FEATURED_ARTICLE.href}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'mt-6 min-w-48 cursor-default justify-between rounded-md bg-white text-black hover:bg-white/90'
              )}
            >
              Ler um artigo
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <main className="m-auto w-full max-w-240 p-8">
        <h2 className="text-md">Artigo em destaque</h2>
        <Separator className="mt-2 mb-4" />
        <Link
          href={FEATURED_ARTICLE.href}
          className="group block cursor-default overflow-hidden"
        >
          <div className="bg-muted mb-3 w-full overflow-hidden rounded-md border sm:float-right sm:mb-2 sm:ml-4 sm:w-56">
            <Image
              src={FEATURED_ARTICLE.image.src}
              alt={FEATURED_ARTICLE.image.alt}
              width={1080}
              height={1080}
              sizes="(min-width: 640px) 224px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <h3 className="text-base font-medium group-hover:underline">
            {FEATURED_ARTICLE.title}
          </h3>
          <p className="text-muted-foreground mt-1 text-justify text-sm leading-relaxed">
            {FEATURED_ARTICLE.summary}
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm">
            Continuar lendo
            <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </main>

      <Footer />
    </>
  )
}
