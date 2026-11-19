import { PenIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const ArticleHeader = ({ title }: { title: string }) => (
  <>
    <div className="flex items-center justify-between">
      <h1 className="text-lg">{title}</h1>
      <div>
        <Button variant="ghost" size="default">
          <PenIcon />
          Editar
        </Button>
        {/* <Button variant="ghost" size="default">
          <LanguagesIcon />
          Linguagem
        </Button> */}
      </div>
    </div>
    <Separator className="my-3" />
  </>
)
