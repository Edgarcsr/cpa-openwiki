'use client'

import { Placeholder } from '@tiptap/extensions'
import { Markdown } from '@tiptap/markdown'
import { EditorContent, useEditor, useEditorState } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { StarterKit } from '@tiptap/starter-kit'
import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  QuoteIcon,
  SearchIcon,
  TypeIcon,
  UnlinkIcon,
  XIcon,
} from 'lucide-react'
import { useState } from 'react'

import { TooltipButton } from '@/components/tooltip-button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface ArticleOption {
  slug: string
  title: string
}

interface ArticleEditorProps {
  articles: ArticleOption[]
  initialBody?: string
  onChange: (markdown: string) => void
}

const MAX_RESULTS = 6
const ARTICLE_PREFIX = '/article/'
const COMBINING_MARKS = /[̀-ͯ]/gu

const normalize = (value: string) =>
  value.normalize('NFD').replaceAll(COMBINING_MARKS, '').toLowerCase()

// Mesma tipografia do artigo publicado (ver article-body.tsx), para o editor
// parecer a própria página.
const PROSE_CLASSES = cn(
  '[&_.tiptap]:min-h-72 [&_.tiptap]:outline-none',
  '[&_p]:text-muted-foreground [&_p]:mb-2 [&_p]:text-justify [&_p]:text-sm',
  '[&_h2]:text-md [&_h2]:mt-5 [&_h2]:mb-2 [&_h2]:border-b [&_h2]:pb-2',
  '[&_strong]:text-foreground [&_a]:text-foreground [&_a]:hover:underline',
  '[&_ul]:text-muted-foreground [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm',
  '[&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:italic'
)

// Mesmo visual dos popovers/dropdowns do shadcn.
const POPOVER_CLASSES =
  'bg-popover text-popover-foreground z-50 flex items-center gap-0.5 rounded-lg p-1 shadow-md ring-1 ring-foreground/10'

const FormatToggle = ({
  label,
  pressed,
  onToggle,
  children,
}: {
  label: string
  pressed: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Toggle
          size="sm"
          aria-label={label}
          pressed={pressed}
          onPressedChange={onToggle}
        />
      }
    >
      {children}
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

const MenuSeparator = () => (
  <Separator orientation="vertical" className="mx-0.5 h-4 self-center" />
)

const LinkSearch = ({
  articles,
  onPick,
  onCancel,
}: {
  articles: ArticleOption[]
  onPick: (article: ArticleOption) => void
  onCancel: () => void
}) => {
  const [query, setQuery] = useState('')
  const results = articles
    .filter((article) => normalize(article.title).includes(normalize(query)))
    .slice(0, MAX_RESULTS)

  return (
    <div className="flex w-64 flex-col gap-1">
      <div className="flex items-center gap-1">
        <InputGroup className="h-7">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            // oxlint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            aria-label="Buscar artigo"
            placeholder="Buscar artigo…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                if (results[0]) {
                  onPick(results[0])
                }
              }
              if (event.key === 'Escape') {
                onCancel()
              }
            }}
            className="h-7 text-sm"
          />
        </InputGroup>
        <TooltipButton
          label="Cancelar"
          variant="ghost"
          size="icon-sm"
          onClick={onCancel}
        >
          <XIcon />
        </TooltipButton>
      </div>
      <ul className="flex flex-col">
        {results.map((article) => (
          <li key={article.slug}>
            <button
              type="button"
              onClick={() => onPick(article)}
              className="hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent w-full cursor-default truncate rounded-md px-1.5 py-1 text-left text-sm outline-none"
            >
              {article.title}
            </button>
          </li>
        ))}
        {results.length === 0 && (
          <li className="text-muted-foreground px-1.5 py-1 text-sm">
            Nenhum artigo encontrado.
          </li>
        )}
      </ul>
    </div>
  )
}

const SelectionMenu = ({
  editor,
  articles,
}: {
  editor: Editor
  articles: ArticleOption[]
}) => {
  const [linking, setLinking] = useState(false)
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive('bold'),
      italic: current.isActive('italic'),
      heading: current.isActive('heading', { level: 2 }),
      list: current.isActive('bulletList'),
      quote: current.isActive('blockquote'),
      link: current.isActive('link'),
    }),
  })

  const chain = () => editor.chain().focus()

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: 'top',
        offset: 8,
        flip: true,
        // Não deixa o menu sair da tela nem ficar atrás da sidebar.
        shift: { padding: 8 },
        onHide: () => setLinking(false),
      }}
      className={POPOVER_CLASSES}
    >
      {linking ? (
        <LinkSearch
          articles={articles}
          onCancel={() => {
            setLinking(false)
            chain().run()
          }}
          onPick={(article) => {
            chain()
              .extendMarkRange('link')
              .setLink({ href: `${ARTICLE_PREFIX}${article.slug}` })
              .run()
            setLinking(false)
          }}
        />
      ) : (
        <>
          <FormatToggle
            label="Negrito"
            pressed={active.bold}
            onToggle={() => chain().toggleBold().run()}
          >
            <BoldIcon />
          </FormatToggle>
          <FormatToggle
            label="Itálico"
            pressed={active.italic}
            onToggle={() => chain().toggleItalic().run()}
          >
            <ItalicIcon />
          </FormatToggle>
          <MenuSeparator />
          <FormatToggle
            label="Seção"
            pressed={active.heading}
            onToggle={() => chain().toggleHeading({ level: 2 }).run()}
          >
            <TypeIcon />
          </FormatToggle>
          <FormatToggle
            label="Lista"
            pressed={active.list}
            onToggle={() => chain().toggleBulletList().run()}
          >
            <ListIcon />
          </FormatToggle>
          <FormatToggle
            label="Citação"
            pressed={active.quote}
            onToggle={() => chain().toggleBlockquote().run()}
          >
            <QuoteIcon />
          </FormatToggle>
          <MenuSeparator />
          {active.link ? (
            <FormatToggle
              label="Remover link"
              pressed
              onToggle={() => chain().extendMarkRange('link').unsetLink().run()}
            >
              <UnlinkIcon />
            </FormatToggle>
          ) : (
            <FormatToggle
              label="Linkar artigo"
              pressed={false}
              onToggle={() => setLinking(true)}
            >
              <LinkIcon />
            </FormatToggle>
          )}
        </>
      )}
    </BubbleMenu>
  )
}

export const ArticleEditor = ({
  articles,
  initialBody,
  onChange,
}: ArticleEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    content: initialBody,
    contentType: 'markdown',
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
        code: false,
        codeBlock: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: false },
      }),
      Markdown,
      Placeholder.configure({
        placeholder: 'Comece a escrever. O primeiro parágrafo vira o resumo.',
      }),
    ],
    onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
  })

  return (
    <div className="flow-root cursor-text">
      {editor && <SelectionMenu editor={editor} articles={articles} />}
      <EditorContent
        editor={editor}
        aria-label="Texto do artigo"
        className={PROSE_CLASSES}
      />
    </div>
  )
}
