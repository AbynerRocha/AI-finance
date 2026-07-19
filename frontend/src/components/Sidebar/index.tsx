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
  { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard, route: '/dashboard' },
  { id: "transactions", label: "Transações", icon: ArrowUpRight, route: '/dashboard' },
  { id: "wallets", label: "Carteiras", icon: Wallet2Icon, route: '/dashboard/wallets' },
  { id: "goals", label: "Metas", icon: Target, route: '/dashboard' },
  { id: "settings", label: "Configurações", icon: Settings, route: '/dashboard' },
];

export function Sidebar({ sidebarOpen, handleLogout, setSidebarOpen }: SidebarProps) {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState<string>(navItems[0].id)

  function handleSelectNav(id: string, route: string) {
    if(activeNav === id) return

    setSidebarOpen(false)
    setActiveNav(id)

    router.navigate({
      to: route
    })
  }

  return (
    <aside
      className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[#071209] border-r border-border flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
    >
      <div className="px-5 py-5 border-b border-border flex items-center justify-between">
        <Logo size={8} />
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-muted-foreground hover:text-foreground p-1"
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, route, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleSelectNav(id, route)}
            className={twMerge(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              activeNav === id ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">Ana Souza</p>
            <p className="text-xs text-muted-foreground truncate">ana.souza@email.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  )
}
