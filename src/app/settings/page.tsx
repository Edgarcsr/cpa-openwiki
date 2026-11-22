import { CogIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { PageShell } from '@/components/page-shell'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { getRequestSession } from '@/lib/session'

export const metadata: Metadata = { title: 'Configurações' }

// Só para quem está logado; visitante vai para o login.
const SessionGuard = async () => {
  const session = await getRequestSession()
  if (!session) {
    redirect('/sign-in')
  }
  return null
}

const SettingsPage = () => (
  <PageShell>
    <h1 className="text-lg">Configurações</h1>
    <p className="text-muted-foreground mt-1 mb-4 text-sm">
      Preferências da sua conta e da wiki.
    </p>
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CogIcon />
        </EmptyMedia>
        <EmptyTitle>Nada para configurar ainda</EmptyTitle>
        <EmptyDescription>
          As opções da conta e da wiki vão aparecer aqui.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
    <Suspense fallback={null}>
      <SessionGuard />
    </Suspense>
  </PageShell>
)

export default SettingsPage
