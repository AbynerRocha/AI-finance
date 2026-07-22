import { Logo } from '#/components/Logo';
import { useRouter } from '@tanstack/react-router';
import { ArrowUpRight, Wallet2Icon, LayoutDashboard, LogOut, Settings, Target, X } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

type SidebarProps = {
  sidebarOpen: boolean;
  handleLogout: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard, route: '/dashboard' },
  { id: 'transactions', label: 'Transações', icon: ArrowUpRight, route: '/dashboard' },
  { id: 'wallets', label: 'Carteiras', icon: Wallet2Icon, route: '/dashboard/wallets' },
  { id: 'goals', label: 'Metas', icon: Target, route: '/dashboard' },
  { id: 'settings', label: 'Configurações', icon: Settings, route: '/dashboard' },
];

const mobileNavItems = navItems.filter(({ id }) => id !== 'settings');

export function Sidebar({ sidebarOpen, handleLogout, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<string>(navItems[0].id);

  function handleSelectNav(id: string, route: string) {
    setSidebarOpen(false);
    setActiveNav(id);

    if (activeNav !== id) {
      router.navigate({ to: route });
    }
  }

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 h-screen
          w-64 bg-[#071209] border-r border-border flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="hidden lg:block pt-5 pl-5">
          <Logo/>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map(({ id, label, route, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleSelectNav(id, route)}
              className={twMerge(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all',
                activeNav === id
                  ? 'bg-primary/10 font-medium text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-border px-3 py-4">
          <div className="mb-2 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground">Ana Souza</p>
              <p className="truncate text-xs text-muted-foreground">ana.souza@email.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut size={15} />
            Sair
          </button>
        </div>
      </aside>

      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-30 flex h-18 items-center justify-around border-t border-border bg-[#071209]/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {mobileNavItems.map(({ id, label, route, icon: Icon }) => {
          const isActive = activeNav === id;

          return (
            <button
              key={id}
              onClick={() => handleSelectNav(id, route)}
              aria-current={isActive ? 'page' : undefined}
              className={twMerge(
                'flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={twMerge(
                  'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
                  isActive && 'bg-primary/15',
                )}
              >
                <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
              </span>
              {label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
