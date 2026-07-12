import { Bell } from "lucide-react";

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;

};

export function Header({ setSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-secondary transition-colors"
        >
          <div className="space-y-1">
            <span className="block w-5 h-0.5 bg-current" />
            <span className="block w-5 h-0.5 bg-current" />
            <span className="block w-3 h-0.5 bg-current" />
          </div>
        </button>
        <div>
          <h1 className="text-lg md:text-xl text-foreground" style={{ fontFamily: "Instrument Serif, serif" }}>
            Visão Geral
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block" style={{ fontFamily: "DM Mono, monospace" }}>
            Julho 2026
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          AS
        </div>
      </div>
    </header>
  )
}
