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
          <span className="text-foreground hover:underline">
            1 de Fevereiro de 2004
          </span>{' '}
          é um membro ativo da{' '}
          <span className="text-foreground hover:underline">C.P.A.</span> sendo
          considerado o fundador da organização. Atualmente cursa Biologia na
          Universidade Federal de São Carlos (UFSCar), tendo diploma de Biologia
          Marinha.
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Durante seu período na UFSCar, Alexandre recebeu a alcunha de{' '}
          <span className="text-foreground hover:underline">
            &ldquo;Roleta&ldquo;
          </span>
          , bem como seus amigos{' '}
          <span className="text-foreground hover:underline">
            &ldquo;Voto&ldquo;
          </span>{' '}
          (de voto de silêncio) e{' '}
          <span className="text-foreground hover:underline">
            &ldquo;Sem Parar&ldquo;
          </span>{' '}
          (porque ele não parava de falar).
        </p>
        <h1 className="text-md mt-5">História</h1>
        <Separator className="my-2" />
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Alexandre de Campos Fernandes, nascido em 1 de Fevereiro de 2004,
          nascido em São Bernardo do Campo, estudou na Unidade I do colégio
          Ábaco (conhecida Abaquinho). Lá conheceu alguns dos primeiros membros
          que comporiam a futura C.P.A., como{' '}
          <span className="text-foreground hover:underline">Luis Fernando</span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Enzo S. Yamane
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Henrico Birochi
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Nicholas Birochi
          </span>{' '}
          e{' '}
          <span className="text-foreground hover:underline">
            Gustavo S. Marmo
          </span>
          . Em 2016 a sala foi transferida para uma nova unidade (conhecida como
          Abacão), quando foi para o 6º ano G, entraram novos membros na escola,
          como{' '}
          <span className="text-foreground hover:underline">
            Edgar C. S. Ribeiro
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Marcos Vinicius
          </span>{' '}
          e{' '}
          <span className="text-foreground hover:underline">
            João Gutierrez
          </span>
          . Que embora demoraram para se tornar amigos, acabaram se tornando
          membros da C.P.A. e ajudando a fundar a organização. Em 2017, no 7º
          ano G, entraram mais 2 membros,{' '}
          <span className="text-foreground hover:underline">
            Henrique T. Kerr Euzébio
          </span>{' '}
          e{' '}
          <span className="text-foreground hover:underline">
            Daniel Miranda
          </span>
          .
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Alguns dos eventos que marcaram com a participação do Alexandre foi o{' '}
          <span className="text-foreground hover:underline">
            Caso das calças
          </span>
          . em 2018, no 8º ano G,{' '}
          <span className="text-foreground hover:underline">Alexandre</span> e{' '}
          <span className="text-foreground hover:underline">Edgar</span> fizeram
          uma das poucas Lost Medias da C.P.A., o{' '}
          <span className="text-foreground hover:underline">
            Trabalho dos Astecas
          </span>
          . Também responsável pelo{' '}
          <span className="text-foreground hover:underline">
            Trabalho da Aceitação
          </span>{' '}
          e mais.
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Depois do do ensino fundamental II, A turma de Alexandre foi para o
          Ensino Médio no colégio Ábaco, porém alguns de seus colegas não
          seguiram com ele, como{' '}
          <span className="text-foreground hover:underline">
            João Gutierrez
          </span>{' '}
          por exemplo. Nesse tempo, foi quando ocorreu a Pandemia do
          Coronavirus, então tiveram apenas alguns dias de aula antes de ser
          iniciada o período de ensino remoto (EAD).
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Após o primeiro ano do Ensino médio ter sido completamente remoto, no
          segundo ano, a escola implementou um período híbrido onde haviam 3
          turmas, onde duas dessas turmas eram presenciais e uma era remota, e a
          turma de Alexandre foi para a turma remota.
        </p>
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          Durante o ensino médio, houveram mais vídeos participatidos quanto os
          outros anos por conta de trabalhos integrados, como{' '}
          <span className="text-foreground hover:underline">
            Integrado Cast - Coronavírus
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Integrado Cast - Interstelar
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Composição Radioativa
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Resenha Crítica - Harry Potter e a Ordem da Fênix
          </span>{' '}
          e{' '}
          <span className="text-foreground hover:underline">
            Abaco Cultural - Olimpíadas
          </span>
          .
        </p>
        <h1 className="text-md mt-5">Criação da C.P.A.</h1>
        <Separator className="my-2" />
        <p className="text-muted-foreground formated mb-2 space-y-3 text-justify text-sm">
          A organização C.P.A. foi criada em 11 de Fevereiro de 2020, durante a
          pandemia, sendo inicialmente composta por{' '}
          <span className="text-foreground hover:underline">
            Alexandre de Campos Fernandes
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">
            Enzo Suematsu Yamane
          </span>
          ,{' '}
          <span className="text-foreground hover:underline">Luis Fernando</span>
          e{' '}
          <span className="text-foreground hover:underline">
            Gustavo S. Marmo
          </span>
          . O nome da organização significa Chupadores de Pica Anônimos
          (C.P.A.).
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
