import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react';
import { ArrowRight, Plus, ShoppingCart, TrendingUp } from "lucide-react";
import { Sidebar } from '#/components/Sidebar';
import { Header } from '#/components/Header';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '#/components/ui/dialog.tsx';
import { Input } from '#/components/Input/index.tsx';
import { createWallet, getUserWallets } from '#/services/wallet/index.ts';
import { AxiosError } from 'axios';
import { formatMoney } from '#/utils/formatCurrency.ts';

export const Route = createFileRoute('/(dashboard)/dashboard')({
  loader: {
    handler: async ({ context }) => {
      try {
        const wallets = await getUserWallets()

        return wallets
      } catch (error) {
        if (error instanceof AxiosError) {
          const err = error.response?.data.error

          if (err === 'EXPIRED_TOKEN') {
            context.auth?.requestNewAccessToken()
          }
        }
      }
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const router = useRouter()
  const { auth } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const wallets = Route.useLoaderData()

  const [newWalletName, setNewWalletName] = useState("");

  async function handleCreateWallet() {
    createWallet({ accessToken: auth?.accessToken!, name: newWalletName })
      .then(() => {
        router.invalidate()
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
    <div className='flex flex-1 justify-center mt-4'>
      {wallets && wallets.length > 0 ? (
        <div className="grid grid-cols-2 grid-rows-3 gap-4">
          {[wallets[0], wallets[0]].map((wallet, idx) => {
            return <span
              key={idx}
              className="flex flex-col bg-card h-56 w-96 rounded-xl p-6 cursor-pointer hover:bg-card/50"
              onClick={() => {
                navigate({
                  to: "/wallet/$walletId",
                  params: {
                    walletId: wallet.id
                  },
                  search: { redirect: undefined },
                  replace: true
                })
              }}
            >
              <h4 className="text-xl font-medium text-card-foreground">{wallet.name}</h4>

              <div className="flex flex-1 flex-col w-full justify-center">
                <span className="text-2xl font-medium">
                  {formatMoney(Number(wallet.amountCent))}
                </span>
                <span className="flex flex-col mt-2 justify-center gap-2">
                  <span>
                    <p className="text-muted-foreground">Última transação</p>
                  </span>

                  <span className="flex flex-row items-center gap-2">
                    <ShoppingCart className="text-muted-foreground" size={18} />
                    <span className="text-sm">R$10,00 - Vestido</span>
                  </span>
                </span>
              </div>
              <footer className='flex items-end justify-end h-10 w-full'>
                <ArrowRight
                  size={26}
                />
              </footer>
            </span>
          })}
        </div>
      )
      : <Dialog>
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
      }
    </div>
  );
}

