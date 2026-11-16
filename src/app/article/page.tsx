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
              <dt className="text-muted-foreground">Organização</dt>
              <dd>C.P.A.</dd>
              <dt className="text-muted-foreground">Instituição</dt>
              <dd>UFSCar</dd>
              <dt className="text-muted-foreground">Curso</dt>
              <dd>Biologia</dd>
            </dl>
          </div>
        </aside>
        <p className="text-muted-foreground formated space-y-3 text-justify text-sm">
          Alexandre de Campos Fernandes, nascido em{' '}
          <span className="text-foreground">1 de Fevereiro de 2004</span> é um
          membro ativo da <span className="text-foreground">C.P.A.</span> sendo
          considerado o fundador da organização. Atualmente cursa Biologia na
          Universidade Federal de São Carlos (UFSCar), tendo diploma de Biologia
          Marinha.
          <br />
          minim consectetur pariatur dolor nulla occaecat cupidatat aliqua
          reprehenderit do duis qui consequat officia nisi ad laborum officia
          veniam labore ex nulla et laborum ad cupidatat eu ad in eiusmod do
          dolor reprehenderit ex anim quis nulla sit et sint consectetur sint
          dolor reprehenderit sunt reprehenderit sit esse qui deserunt commodo
          pariatur id proident amet culpa non et ut duis elit deserunt nostrud
          occaecat cupidatat consequat sit ullamco nostrud tempor. Duis in nisi
          proident. Elit deserunt occaecat amet non nostrud amet quis labore
          reprehenderit est ad proident et. Aute veniam occaecat exercitation.
          Aliquip sint sint proident consectetur voluptate ex enim. Aute sit
          enim minim velit incididunt elit eiusmod Lorem ex incididunt aliquip
          culpa minim nulla sint. Deserunt sunt reprehenderit eiusmod proident
          ex proident. Commodo cillum culpa nisi pariatur quis ullamco tempor et
          ullamco exercitation. Ullamco dolore magna culpa sint sunt ad deserunt
          cupidatat adipisicing eiusmod officia eu mollit incididunt mollit.
          Exercitation incididunt laborum aute. Enim voluptate mollit Lorem
          culpa irure velit aliqua sint eiusmod elit dolore reprehenderit labore
          amet. Lorem esse anim duis anim nulla. Aute culpa anim adipisicing
          pariatur magna consectetur amet ad labore aliquip ut minim consequat
          pariatur pariatur. Do ipsum duis in ex consectetur. Id elit laborum
          voluptate sint duis exercitation mollit aliquip exercitation.
          Excepteur cillum ad quis irure aliqua ipsum cillum. Officia in
          incididunt et nulla enim labore consectetur. Ex voluptate anim mollit
          pariatur aute ullamco cillum sunt mollit incididunt. Pariatur ad nisi
          veniam qui qui. Ad deserunt dolor aliquip id dolor do nisi nisi enim
          irure ea in dolor mollit ullamco. Minim veniam quis ad in aliquip in
          cillum adipisicing Lorem nostrud irure fugiat minim excepteur. Irure
          proident enim commodo non ullamco dolore nulla consectetur aliquip
          dolor. In eiusmod laborum sint ad. Consequat veniam consequat irure
          veniam aliqua nisi non quis sit aliqua ea quis pariatur ullamco. Duis
          do dolor esse adipisicing laborum est. Mollit eiusmod commodo in
          officia quis aliquip cupidatat. Laborum non officia cupidatat sint
          veniam non reprehenderit enim ullamco officia Lorem ad. Dolore laborum
          voluptate eiusmod veniam excepteur adipisicing. Ea exercitation
          commodo eu minim sit nisi sunt pariatur laborum amet. Consectetur
          pariatur sint aliqua cupidatat laborum reprehenderit labore ad
          voluptate laborum qui irure. Mollit eiusmod nisi deserunt deserunt
          esse incididunt eu ipsum. Ad sit proident tempor consectetur consequat
          irure laboris ad laborum. In quis adipisicing ea esse ea fugiat amet
          et anim excepteur est mollit dolor labore et. Sit in fugiat ad magna
          incididunt magna aliquip aliquip anim reprehenderit. Qui est sit
          incididunt fugiat ex cillum voluptate minim. Dolore veniam qui do
          irure occaecat fugiat consequat voluptate officia ut. Deserunt nisi
          aliqua est ex amet tempor commodo exercitation ullamco minim quis et
          proident. Esse duis cupidatat non magna. Ea Lorem do reprehenderit
          Lorem excepteur esse id qui esse officia enim sunt eu. Ipsum non
          deserunt labore adipisicing esse dolor Lorem cillum pariatur ea. Minim
          duis consequat excepteur culpa nostrud laborum in laborum duis enim
          excepteur nostrud Lorem et. Consectetur duis non esse cillum dolore
          sunt culpa sit nulla nulla voluptate cillum commodo voluptate officia.
          Ipsum incididunt culpa nulla proident fugiat. Cillum eiusmod dolore
          reprehenderit in eiusmod officia. Nulla cupidatat fugiat Lorem aute
          amet mollit consequat eu est et qui veniam ut et qui. Nisi consectetur
          proident irure eiusmod aliquip magna quis adipisicing anim irure
          commodo nisi amet ut tempor. Cupidatat occaecat anim proident tempor
          enim laboris ut magna cupidatat veniam laboris exercitation. Minim sit
          reprehenderit consectetur est id officia proident nisi et tempor ea
          reprehenderit nulla.
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
