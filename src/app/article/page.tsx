import type { COBEOptions } from 'cobe'
import { LanguagesIcon } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Globe } from '@/components/ui/globe'
import { Separator } from '@/components/ui/separator'

const ARTICLE_GLOBE_CONFIG: Partial<COBEOptions> = {
  theta: 0.5,
  markers: [],
}

export default function ArticlePage() {
  return (
    <div>
      <main className="m-auto max-w-240 p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-lg">Alexandre de Campos Fernandes</h1>
          <div>
            <Button variant="ghost" size="default">
              <LanguagesIcon />
              Linguagem
            </Button>
          </div>
        </div>
        <Separator className="my-3" />
        <aside className="bg-muted/50 mb-4 w-full overflow-hidden rounded-md border text-sm md:float-right md:mb-4 md:ml-4 md:w-72">
          <Image
            src="/alexandre-fernandes.webp"
            alt="Alexandre de Campos Fernandes"
            className="mx-auto"
            width={400}
            height={400}
          />
          <div className="p-4">
            <h2 className="mb-2 text-center font-medium">
              Alexandre de Campos Fernandes
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-muted-foreground">Nascimento</dt>
              <dd>1 de Fevereiro de 2004</dd>
              <dt className="text-muted-foreground">Instituição</dt>
              <dd>UFSCar</dd>
              <dt className="text-muted-foreground">Curso</dt>
              <dd>Biologia</dd>
            </dl>
          </div>
        </aside>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Alexandre de Campos Fernandes, nascido em{' '}
          <span className="text-foreground">1 de Fevereiro de 2004</span> é um
          membro ativo da <span className="text-foreground">C.P.A.</span> sendo
          considerado o fundador da organização. Atualmente cursa Biologia na
          Universidade Federal de São Carlos (UFSCar), tendo diploma de Biologia
          Marinha.
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Durante seu período na UFSCar, Alexandre recebeu a alcunha de{' '}
          <span className="text-foreground">&ldquo;Roleta&ldquo;</span>, bem
          como seus amigos{' '}
          <span className="text-foreground">&ldquo;Voto&ldquo;</span> (de voto
          de silêncio) e{' '}
          <span className="text-foreground">&ldquo;Sem Parar&ldquo;</span>{' '}
          (porque ele não parava de falar).
        </p>
        <h1 className="text-md mt-5">História</h1>
        <Separator className="my-2" />
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Alexandre de Campos Fernandes, nascido em 1 de Fevereiro de 2004,
          nascido em São Bernardo do Campo, estudou na Unidade I do colégio
          Ábaco (conhecida Abaquinho). Lá conheceu alguns dos primeiros membros
          que comporiam a futura C.P.A., como{' '}
          <span className="text-foreground">Luis Fernando</span>,{' '}
          <span className="text-foreground">Enzo S. Yamane</span>,{' '}
          <span className="text-foreground">Henrico Birochi</span>,{' '}
          <span className="text-foreground">Nicholas Birochi</span> e{' '}
          <span className="text-foreground">Gustavo S. Marmo</span>. Em 2016 a
          sala foi transferida para uma nova unidade (conhecida como Abacão),
          quando foi para o 6º ano G, entraram novos membros na escola, como{' '}
          <span className="text-foreground">Edgar C. S. Ribeiro</span>,{' '}
          <span className="text-foreground">Marcos Vinicius</span> e{' '}
          <span className="text-foreground">João Gutierrez</span>. Que embora
          demoraram para se tornar amigos, acabaram se tornando membros da
          C.P.A. e ajudando a fundar a organização. Em 2017, no 7º ano G,
          entraram mais 2 membros,{' '}
          <span className="text-foreground">Henrique T. Kerr Euzébio</span> e{' '}
          <span className="text-foreground">Daniel Miranda</span>.
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Alguns dos eventos que marcaram com a participação do Alexandre foi o{' '}
          <span className="text-foreground">Caso das calças</span>. em 2018, no
          8º ano G, <span className="text-foreground">Alexandre</span> e{' '}
          <span className="text-foreground">Edgar</span> fizeram uma das poucas
          Lost Medias da C.P.A., o{' '}
          <span className="text-foreground">Trabalho dos Astecas</span>. Também
          responsável pelo{' '}
          <span className="text-foreground">Trabalho da Aceitação</span> e mais.
        </p>
      </main>
      <Globe
        config={ARTICLE_GLOBE_CONFIG}
        speed={0.0005}
        className="fixed inset-auto right-[calc(-0.51*var(--globe))] bottom-[calc(-0.39*var(--globe))] hidden w-(--globe) max-w-none opacity-40 [--globe:min(41rem,calc(100vw-60rem))] xl:block"
      />
    </div>
  )
}
