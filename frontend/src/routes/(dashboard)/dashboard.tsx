import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Plus } from "lucide-react";
import { Sidebar } from '#/components/Sidebar';
import { Header } from '#/components/Header';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '#/components/ui/dialog.tsx';
import { Input } from '#/components/Input/index.tsx';
import { createWallet, getUserWallets } from '#/services/wallet/index.ts';
import { AxiosError } from 'axios';

export const Route = createFileRoute('/(dashboard)/dashboard')({
  loader: {
    handler: () => getUserWallets()
  },
  component: Dashboard,
})

function Dashboard() {
  const { auth } = Route.useRouteContext()
  const wallets = Route.useLoaderData()

  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");

  console.log(wallets)

  async function handleCreateWallet() {
    createWallet({ accessToken: auth?.accessToken!, name: newWalletName })
      .then(() => {

      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const errorName = error.response?.data.error

          if (errorName === 'EXPIRED_TOKEN') {
            auth?.requestNewAccessToken()
              .then(() => handleCreateWallet)
              .catch((err: AxiosError) => console.error(err))
          }
        }
      })
  }


  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        handleLogout={() => { }}
        setSidebarOpen={setSidebarOpen}
      />
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
        />
      )}
      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <Header
          setSidebarOpen={setSidebarOpen}
        />

        <div className='flex flex-1 justify-center mt-4'>
          {}
          <Dialog>
            <DialogTrigger className="flex flex-col items-center justify-center w-1/2 h-56 rounded-xl bg-card mx-10 p-3 space-y-3">
              <h2 className="text-2xl font-semibold text-foreground">Criar Carteira</h2>
              <Plus size={48} className="text-muted-foreground" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  Criar Carteira
                </DialogTitle>
              </DialogHeader>

              <div>
                <Input
                  label="Nome da Carteira"
                  placeholder="Digite o nome da carteira"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                />
              </div>

              <DialogFooter className="space-x-2">
                <button
                  className="border border-primary text-primary hover:text-primary-foreground hover:bg-primary/80 px-4 py-1 rounded-lg"
                  onClick={handleCreateWallet}
                >
                  Criar
                </button>
                <DialogClose className="border border-destructive text-destructive hover:text-destructive-foreground hover:bg-destructive/80 px-4 py-1 rounded-lg">
                  Cancelar
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      </main>
    </div>
  );
}

