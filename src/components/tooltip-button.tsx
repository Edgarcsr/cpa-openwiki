'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

type TooltipSide = 'top' | 'bottom' | 'left' | 'right'

// Botão (geralmente só com ícone) cuja dica aparece no tooltip do shadcn. O
// mesmo texto vira o aria-label, para leitores de tela.
export const TooltipButton = ({
  label,
  side = 'top',
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  label: string
  side?: TooltipSide
}) => (
  <Tooltip>
    <TooltipTrigger
      render={<Button type="button" aria-label={label} {...props} />}
    >
      {children}
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>
)
