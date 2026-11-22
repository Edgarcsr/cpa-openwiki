'use client'

import { ArrowLeftIcon, SendIcon, TableIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { ArticleEditor } from '@/components/article-editor'
import type { ArticleOption } from '@/components/article-editor'
import { InfoboxPanel, emptyRows } from '@/components/infobox-panel'
import type { InfoRow } from '@/components/infobox-panel'
import { Notice } from '@/components/notice'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { usePhoto } from '@/components/use-photo'
import { useProposalSubmit } from '@/components/use-proposal-submit'
import type { ArticleImage } from '@/lib/article'
import { ARTICLE_CATEGORIES } from '@/lib/article-categories'
import type { ArticleCategory } from '@/lib/article-categories'
import { slugify } from '@/lib/article-draft'
import { draftSchema } from '@/lib/article-schema'
import { authClient } from '@/lib/auth-client'
import { canModerate } from '@/lib/roles'
import { cn } from '@/lib/utils'

export interface InitialArticle {
  slug: string
  title: string
  category: ArticleCategory
  infobox: [label: string, value: string][]
  body: string
  image?: ArticleImage
}

interface ArticleFormProps {
  articles: ArticleOption[]
  // Preenchido ao editar um artigo existente (o endereço fica travado).
  initial?: InitialArticle
  // `?slug=` dos links vermelhos.
  initialSlug?: string
}

interface CategoryItem {
  value: ArticleCategory
  label: string
}

const CATEGORY_ITEMS: CategoryItem[] = (
  Object.entries(ARTICLE_CATEGORIES) as [ArticleCategory, string][]
).map(([value, label]) => ({ value, label }))

const DEFAULT_CATEGORY = CATEGORY_ITEMS[0] as CategoryItem

// Campo sem borda que parece texto até receber foco.
const GHOST_INPUT =
  'h-6 w-full min-w-0 rounded-sm border border-transparent bg-transparent px-1 outline-none hover:border-input focus:border-ring placeholder:text-muted-foreground/60'

const toRows = (infobox: [string, string][]): InfoRow[] =>
  infobox.length === 0
    ? emptyRows()
    : infobox.map(([label, value], id) => ({ id, label, value }))

const initialFields = (
  initial: InitialArticle | undefined,
  initialSlug: string
) => ({
  title: initial?.title ?? initialSlug.replaceAll('-', ' '),
  category:
    CATEGORY_ITEMS.find((item) => item.value === initial?.category) ??
    DEFAULT_CATEGORY,
  rows: toRows(initial?.infobox ?? []),
  body: initial?.body ?? '',
  withInfobox: Boolean(initial?.infobox.length || initial?.image),
})

const buildDraft = (fields: {
  title: string
  category: CategoryItem
  rows: InfoRow[]
  withInfobox: boolean
  body: string
}) => ({
  title: fields.title,
  category: fields.category.value,
  infobox: (fields.withInfobox ? fields.rows : [])
    .filter((row) => row.label.trim() && row.value.trim())
    .map((row): [string, string] => [row.label, row.value]),
  body: fields.body,
  imageAlt: fields.title,
})

const submitLabel = (isAdmin: boolean, isEdit: boolean) => {
  if (isAdmin) {
    return 'Publicar'
  }
  return isEdit ? 'Propor edição' : 'Enviar para análise'
}

const CategoryPicker = ({
  value,
  onChange,
}: {
  value: CategoryItem
  onChange: (next: CategoryItem) => void
}) => (
  <Combobox
    items={CATEGORY_ITEMS}
    value={value}
    itemToStringLabel={(item: CategoryItem) => item.label}
    onValueChange={(next: CategoryItem | null) => {
      if (next) {
        onChange(next)
      }
    }}
  >
    <ComboboxInput
      aria-label="Categoria"
      placeholder="Categoria…"
      className="h-7 w-32"
    />
    <ComboboxContent>
      <ComboboxEmpty>Nenhuma categoria.</ComboboxEmpty>
      <ComboboxList>
        {(item: CategoryItem) => (
          <ComboboxItem key={item.value} value={item}>
            {item.label}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
)

const SlugField = ({
  slug,
  locked,
  taken,
  onChange,
}: {
  slug: string
  locked: boolean
  taken: boolean
  onChange: (slug: string) => void
}) => (
  <label className="flex items-center gap-1">
    /article/
    <input
      aria-label="Endereço"
      value={slug}
      readOnly={locked}
      onChange={(e) => onChange(slugify(e.target.value))}
      aria-invalid={taken}
      placeholder="endereco"
      className={cn(
        GHOST_INPUT,
        'text-foreground w-44',
        locked && 'hover:border-transparent',
        taken && 'border-destructive'
      )}
      required
    />
    {taken && <span className="text-destructive">já existe</span>}
  </label>
)

interface FieldsProps extends ArticleFormProps {
  isAdmin: boolean
  submitState: ReturnType<typeof useProposalSubmit>
}

const SubmitButton = ({
  isAdmin,
  isEdit,
  disabled,
}: {
  isAdmin: boolean
  isEdit: boolean
  disabled: boolean
}) => (
  <Tooltip>
    <TooltipTrigger render={<Button type="submit" disabled={disabled} />}>
      <SendIcon />
      {submitLabel(isAdmin, isEdit)}
    </TooltipTrigger>
    <TooltipContent side="bottom">
      {isAdmin
        ? 'Publica direto na wiki.'
        : 'Um administrador analisa antes de publicar.'}
    </TooltipContent>
  </Tooltip>
)

// Mesmo layout da página do artigo: título no lugar do h1 com as ações à
// direita, infobox flutuando e o texto logo abaixo.
const ArticleFields = ({
  articles,
  initial,
  initialSlug = '',
  isAdmin,
  submitState,
}: FieldsProps) => {
  const { status, setStatus, submit } = submitState
  const photo = usePhoto(initial?.image?.src)
  const isEdit = Boolean(initial)

  const start = initialFields(initial, initialSlug)
  const [title, setTitle] = useState(start.title)
  const [slugOverride, setSlugOverride] = useState(initialSlug)
  const [category, setCategory] = useState(start.category)
  const [rows, setRows] = useState(start.rows)
  const [body, setBody] = useState(start.body)
  const [withInfobox, setWithInfobox] = useState(start.withInfobox)

  const slug = initial?.slug ?? (slugOverride || slugify(title))
  const slugTaken = !isEdit && articles.some((article) => article.slug === slug)
  const draft = buildDraft({ title, category, rows, withInfobox, body })
  const canSubmit =
    draftSchema.safeParse(draft).success &&
    Boolean(slug) &&
    !slugTaken &&
    status.type !== 'sending'
  const errorMessage = status.type === 'error' ? status.message : photo.error
  const backHref = initial ? `/article/${initial.slug}` : '/'

  const handleSubmit = () => {
    if (!canSubmit) {
      return
    }
    setStatus({ type: 'sending' })
    submit({
      kind: isEdit ? 'edit' : 'create',
      slug,
      draft,
      image: photo.file,
      removeImage: photo.removeExisting,
    })
  }
  const handlePickImage = photo.pick
  const handleRemoveImage = photo.remove

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <input
          aria-label="Título"
          placeholder="Título do artigo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-lg outline-none"
          required
        />
        <div className="flex shrink-0 items-center gap-1">
          <Link
            href={backHref}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'cursor-default'
            )}
          >
            <ArrowLeftIcon />
            Cancelar
          </Link>
          <SubmitButton
            isAdmin={isAdmin}
            isEdit={isEdit}
            disabled={!canSubmit}
          />
        </div>
      </div>
      <Separator className="my-3" />

      <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
        <CategoryPicker value={category} onChange={setCategory} />
        <SlugField
          slug={slug}
          locked={isEdit}
          taken={slugTaken}
          onChange={setSlugOverride}
        />
        {!withInfobox && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setWithInfobox(true)}
          >
            <TableIcon />
            Adicionar tabela
          </Button>
        )}
        {errorMessage && (
          <span role="alert" className="text-destructive ml-auto">
            {errorMessage}
          </span>
        )}
      </div>

      {withInfobox && (
        <InfoboxPanel
          title={title}
          rows={rows}
          onRowsChange={setRows}
          imageSrc={photo.shownSrc}
          onPickImage={handlePickImage}
          onRemoveImage={handleRemoveImage}
          onRemove={() => setWithInfobox(false)}
        />
      )}

      <ArticleEditor
        articles={articles}
        initialBody={initial?.body}
        onChange={setBody}
      />
    </form>
  )
}

// Só quem está logado propõe; o servidor confere de novo em /api/proposals.
export const ArticleForm = (props: ArticleFormProps) => {
  const { data: session, isPending } = authClient.useSession()
  const submitState = useProposalSubmit()

  if (isPending) {
    return null
  }

  if (!session) {
    const action = props.initial ? 'propor uma edição' : 'criar uma página'
    return (
      <Notice
        text={`Entre na sua conta para ${action}.`}
        href="/sign-in"
        action="Entrar"
      />
    )
  }

  if (submitState.status.type === 'sent') {
    return (
      <Notice
        title="Proposta enviada!"
        text="Um administrador vai analisar. Você acompanha o andamento em Propostas."
        href="/proposals"
        action="Ver minhas propostas"
      />
    )
  }

  return (
    <ArticleFields
      {...props}
      isAdmin={canModerate(session.user.role)}
      submitState={submitState}
    />
  )
}
