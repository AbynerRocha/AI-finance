import { useAuth } from "#/contexts/Auth.tsx";
import dayjs from 'dayjs'

type HeaderProps = {
  setSidebarOpen: (open: boolean) => void;

};

export function Header({ setSidebarOpen }: HeaderProps) {
  const auth = useAuth()

  return (
    <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg md:text-xl text-foreground">
            Olá {auth.user?.name}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {dayjs(Date.now()).format("MMMM YYYY")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        {/* <button className="relative text-muted-foreground hover:text-foreground transition-colors p-2">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button> */}
        {/* <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold">
          AS
        </div> */}
      </div>
    </header>
  )
}
