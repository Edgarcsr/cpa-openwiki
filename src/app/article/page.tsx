import type { COBEOptions } from 'cobe'
import { LanguagesIcon } from 'lucide-react'

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
        <p className="text-muted-foreground formated text-justify text-sm">
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
          occaecat cupidatat consequat sit ullamco nostrud tempor
        </p>
      </main>
      <Globe
        config={ARTICLE_GLOBE_CONFIG}
        speed={0.0005}
        className="fixed inset-auto -right-84 -bottom-64 w-164 max-w-none opacity-40"
      />
    </div>
  )
}
