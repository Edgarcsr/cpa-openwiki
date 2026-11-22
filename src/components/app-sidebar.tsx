'use client'

import {
  ChevronsUpDownIcon,
  CogIcon,
  DownloadIcon,
  FilePlusIcon,
  HouseIcon,
  InboxIcon,
  LogOutIcon,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useJson } from '@/components/use-json'
import { authClient } from '@/lib/auth-client'
import { canModerate } from '@/lib/roles'
import type { ProposalStatus } from '@/lib/store-types'

interface SidebarUser {
  name: string
  email: string
  role?: string | null
}

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

const NavLink = ({
  href,
  label,
  icon,
  active,
}: {
  href: string
  label: string
  icon: React.ReactNode
  active: boolean
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      isActive={active}
      tooltip={label}
      render={<Link href={href} />}
    >
      {icon}
      <span>{label}</span>
    </SidebarMenuButton>
  </SidebarMenuItem>
)

// Remonta a cada navegação (key = pathname), então o contador se atualiza
// depois de aceitar ou rejeitar uma proposta.
const ModerationGroup = ({ pathname }: { pathname: string }) => {
  const { state } = useJson<{ status: ProposalStatus }[]>('/api/proposals')
  const pending =
    state.type === 'ready'
      ? state.data.filter((proposal) => proposal.status === 'pending').length
      : 0

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Moderação</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={pathname.startsWith('/proposals')}
              tooltip="Propostas"
              render={<Link href="/proposals" />}
            >
              <InboxIcon />
              <span>Propostas</span>
            </SidebarMenuButton>
            {pending > 0 && <SidebarMenuBadge>{pending}</SidebarMenuBadge>}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Exportar backup"
              render={
                // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- o texto vem dos filhos do SidebarMenuButton
                <a href="/api/export" download />
              }
            >
              <DownloadIcon />
              <span>Exportar backup</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

const NavUser = ({ user }: { user: SidebarUser }) => {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="cursor-default" />}
          >
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <span className="block truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {canModerate(user.role) ? 'Administrador' : 'Colaborador'}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// Só é renderizada para quem está logado (ver app-shell.tsx).
export const AppSidebar = ({ user }: { user: SidebarUser }) => {
  const pathname = usePathname()
  const moderator = canModerate(user.role)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-8 cursor-default items-center px-2 group-data-[collapsible=icon]:hidden"
          >
            <Image
              src="/openwiki-logo.svg"
              alt="OpenWiki"
              width={1545}
              height={222}
              className="h-3.5 w-auto dark:invert"
            />
          </Link>
          {/* Fica na sidebar (fixa) para sempre dar para recolher/expandir, mesmo
              com o cabeçalho da página rolado para fora da tela. */}
          <Tooltip>
            <TooltipTrigger
              render={
                <SidebarTrigger
                  aria-label="Recolher ou expandir o menu"
                  className="cursor-default group-data-[collapsible=icon]:mx-auto"
                />
              }
            />
            <TooltipContent side="right">
              Recolher / expandir (Ctrl+B)
            </TooltipContent>
          </Tooltip>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Wiki</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLink
                href="/"
                label="Início"
                icon={<HouseIcon />}
                active={pathname === '/'}
              />
              <NavLink
                href="/create"
                label="Criar página"
                icon={<FilePlusIcon />}
                active={pathname === '/create'}
              />
              {!moderator && (
                <NavLink
                  href="/proposals"
                  label="Minhas propostas"
                  icon={<InboxIcon />}
                  active={pathname.startsWith('/proposals')}
                />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {moderator && <ModerationGroup key={pathname} pathname={pathname} />}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <NavLink
            href="/settings"
            label="Configurações"
            icon={<CogIcon />}
            active={pathname.startsWith('/settings')}
          />
        </SidebarMenu>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
