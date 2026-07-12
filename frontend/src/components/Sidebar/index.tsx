import { Logo } from '#/components/Logo';
import { ArrowUpRight, CreditCard, LayoutDashboard, LogOut, Settings, Target, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type SidebarProps = {
  activeNav: string;
  sidebarOpen: boolean;
  setActiveNav: (nav: string) => void;
  handleLogout: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
  { id: "transactions", label: "Transações", icon: ArrowUpRight },
  { id: "cards", label: "Cartões", icon: CreditCard },
  { id: "goals", label: "Metas", icon: Target },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function Sidebar({ sidebarOpen, activeNav, setActiveNav, handleLogout, setSidebarOpen }: SidebarProps) {
  

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
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveNav(id); setSidebarOpen(false); }}
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
