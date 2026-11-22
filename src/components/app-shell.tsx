import { headers } from 'next/headers'
import { Suspense } from 'react'

import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getSession } from '@/lib/session'

// Decide no servidor se há sessão, então a sidebar já chega no HTML (sem
// "piscar" depois que a página carrega). Entrar e sair chamam
// router.refresh(), que refaz esta parte.
const SessionSidebar = async () => {
  const session = await getSession(await headers())
  if (!session) {
    return null
  }
  const { name, email, role } = session.user
  return <AppSidebar user={{ name, email, role }} />
}

// O provider fica sempre montado; a sidebar só aparece para quem está logado.
export const AppShell = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <Suspense fallback={null}>
      <SessionSidebar />
    </Suspense>
    <div className="relative flex w-full min-w-0 flex-1 flex-col">
      {children}
    </div>
  </SidebarProvider>
)
