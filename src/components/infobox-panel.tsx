'use client'

import { ImagePlusIcon, PlusIcon, XIcon } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'

import { TooltipButton } from '@/components/tooltip-button'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface InfoRow {
  id: number
  label: string
  value: string
}

interface InfoboxPanelProps {
  title: string
  rows: InfoRow[]
  onRowsChange: (rows: InfoRow[]) => void
  // Foto atual (existente ou recém escolhida), se houver.
  imageSrc: string | null
  onPickImage: (file: File | undefined) => void
  onRemoveImage: () => void
  onRemove: () => void
}

// Campo sem borda que parece texto até receber foco.
const GHOST_INPUT =
  'h-6 w-full min-w-0 rounded-sm border border-transparent bg-transparent px-1 outline-none hover:border-input focus:border-ring placeholder:text-muted-foreground/60'

export const emptyRows = (): InfoRow[] => [{ id: 0, label: '', value: '' }]

export const InfoboxPanel = ({
  title,
  rows,
  onRowsChange,
  imageSrc,
  onPickImage,
  onRemoveImage,
  onRemove,
}: InfoboxPanelProps) => {
  const fileInput = useRef<HTMLInputElement>(null)

  const updateRow = (id: number, patch: Partial<InfoRow>) =>
    onRowsChange(
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    )

  const addRow = () => {
    const nextId = Math.max(-1, ...rows.map((row) => row.id)) + 1
    onRowsChange([...rows, { id: nextId, label: '', value: '' }])
  }

  return (
    <aside className="bg-muted/50 relative mb-4 w-full overflow-hidden rounded-md border text-sm md:float-right md:mb-4 md:ml-4 md:w-72">
      <TooltipButton
        label="Remover tabela"
        variant="ghost"
        size="icon-xs"
        className="text-muted-foreground absolute top-2 right-2 z-10"
        onClick={onRemove}
      >
        <XIcon />
      </TooltipButton>
      {imageSrc && (
        <div className="bg-muted relative aspect-4/3 w-full">
          <Image
            src={imageSrc}
            alt="Foto do artigo"
            fill
            unoptimized
            className="object-cover"
          />
          <TooltipButton
            label="Remover foto"
            variant="secondary"
            size="icon-xs"
            className="absolute top-2 left-2"
            onClick={onRemoveImage}
          >
            <XIcon />
          </TooltipButton>
        </div>
      )}
      <div className="p-4">
        <h2 className="mb-2 text-center font-medium">
          {title || 'Título do artigo'}
        </h2>
        <div className="grid grid-cols-[5.5rem_1fr_auto] items-center gap-x-1 gap-y-1">
          {rows.map((row) => (
            <div key={row.id} className="contents">
              <input
                aria-label="Rótulo"
                placeholder="Rótulo"
                value={row.label}
                onChange={(e) => updateRow(row.id, { label: e.target.value })}
                className={cn(GHOST_INPUT, 'text-muted-foreground')}
              />
              <input
                aria-label="Valor"
                placeholder="Valor"
                value={row.value}
                onChange={(e) => updateRow(row.id, { value: e.target.value })}
                className={GHOST_INPUT}
              />
              <TooltipButton
                label="Remover linha"
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
                onClick={() =>
                  onRowsChange(rows.filter((r) => r.id !== row.id))
                }
              >
                <XIcon />
              </TooltipButton>
            </div>
          ))}
        </div>
        <div className="text-muted-foreground mt-2 flex gap-1">
          <Button type="button" variant="ghost" size="xs" onClick={addRow}>
            <PlusIcon />
            Linha
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => fileInput.current?.click()}
          >
            <ImagePlusIcon />
            {imageSrc ? 'Trocar foto' : 'Foto'}
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="image/webp,image/png,image/jpeg"
            aria-label="Enviar foto"
            className="hidden"
            onChange={(event) => {
              onPickImage(event.target.files?.[0])
              event.target.value = ''
            }}
          />
        </div>
      </div>
    </aside>
  )
}
