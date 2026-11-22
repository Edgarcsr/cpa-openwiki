import { Footer } from '@/components/footer'
import { SiteHeader } from '@/components/site-header'

// Estrutura comum de todas as páginas: cabeçalho, conteúdo e rodapé. O
// conteúdo cresce (`flex-1`), então o rodapé fica sempre no fim da página e
// com o mesmo espaçamento, tenha a página muito ou pouco conteúdo.
export const PageShell = ({
  header,
  children,
}: {
  // A home troca o cabeçalho pelo banner (que já inclui o cabeçalho).
  header?: React.ReactNode
  children: React.ReactNode
}) => (
  <div className="flex min-h-svh flex-col">
    {header ?? <SiteHeader />}
    <main className="mx-auto w-full max-w-240 flex-1 p-8">{children}</main>
    <Footer />
  </div>
)
