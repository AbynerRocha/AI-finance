import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '#/components/ui/dialog.tsx';
import { Input } from '#/components/Input/index.tsx';
import { createWallet, getUserWallets } from '#/services/wallet/index.ts';
import { AxiosError } from 'axios';
import { formatMoney } from '#/utils/formatCurrency.ts';
import WalletComponent from '#/components/Dashboard/WalletComponent.tsx';
import { Sparkle, ArrowUp, MoveRight, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';



export const Route = createFileRoute('/(dashboard)/dashboard/')({
  loader: {
    handler: async ({ context }) => {
      try {
        const data = await getUserWallets()
        return data
      } catch (error) {
        if (error instanceof AxiosError) {
          const err = error.response?.data.error

          if (err === 'EXPIRED_TOKEN') {
            context.auth?.requestNewAccessToken()
              .catch((err) => {
                if (err instanceof AxiosError) {
                  if (err.response?.data.error === 'VALIDATION_ERROR') {
                    context.auth?.logout()
                    if (err.response.data.redirect) {
                      return redirect({
                        to: err.response.data.redirect
                      })
                    }
                  }
                }
              })
            return
          }
        }
        throw error
      }
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const router = useRouter()
  const { auth } = Route.useRouteContext()
  const navigate = Route.useNavigate()
  const data = Route.useLoaderData()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWalletName, setNewWalletName] = useState("");

  async function handleCreateWallet(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      createWallet({ accessToken: auth?.accessToken!, name: newWalletName })

      router.invalidate()
      setIsDialogOpen(false)
      setNewWalletName("")
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError) {
        const errorName = error.response?.data.error

        if (errorName === 'EXPIRED_TOKEN') {
          auth?.requestNewAccessToken()
            .then(() => handleCreateWallet(event))
            .catch((err: AxiosError) => console.error(err))
        }
      }
    }
  }

  return <div className='flex flex-col flex-1 mt-4 px-14'>
    <header className="flex flex-row justify-between p-4 w-full h-36 bg-card border border-border rounded-lg shadow-md/20">
      <div className="flex flex-col pt-1 px-3 h-full w-full md:w-148 space-y-3">
        <div className="space-y-3">
          <h6 className="text-secondary-foreground uppercase text-sm md:text-xs">Patrimônio Total</h6>
          <h4 className="text-card-foreground text-3xl md:text-4xl font-bold">
            {formatMoney(data?.balance || 0)}
          </h4>
        </div>
        <span className="bg-secondary py-1 px-2 md:py-1 md:px-4 rounded-full flex items-center max-w-32 md:max-w-36">
          <span className="flex flex-row items-center text-primary gap-1">
            <ArrowUp size={14} />
            <p className="text-xs">8.4% neste mês</p>
          </span>
        </span>
      </div>
      <div className="hidden md:block bg-border w-0.5 h-full" />
      <div className="hidden md:flex flex-1 items-center justify-between px-6 pt-1">
        <div className="space-y-3">
          <h6 className="text-secondary-foreground text-xs uppercase">Carteiras Ativas</h6>
          <h4 className="text-4xl font-bold">{data?.wallets?.length || '0'}</h4>
          <p className="text-xs text-secondary-foreground">Você está no controle</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            className="bg-accent text-accent-foreground h-10 w-40 lg:h-12 lg:w-48 rounded-lg  text-sm font-bold flex items-center justify-center gap-1 cursor-pointer active:bg-accent hover:bg-accent/90"
          >
            <Plus size={20} />
            Nova carteira
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Criar Carteira
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateWallet}>
              <Input
                label="Nome da Carteira"
                placeholder="Digite o nome da carteira"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
              />


              <DialogFooter className="space-x-2">
                <button
                  className="border border-primary text-primary hover:text-primary-foreground hover:bg-primary/80 px-4 py-1 rounded-lg"
                  type="submit"
                >
                  Criar
                </button>
                <DialogClose className="border border-destructive text-destructive hover:text-destructive-foreground hover:bg-destructive/80 px-4 py-1 rounded-lg">
                  Cancelar
                </DialogClose>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </header>
    <section className="md:hidden grid grid-cols-2 grid-rows-1 gap-3 place-items-center mt-5">
      <div className="flex flex-col justify-center h-32 w-full bg-card border border-border rounded-xl p-5">
        <h6 className="text-secondary-foreground/80 uppercase text-sm">Receitas</h6>
        <h5 className="text-xl font-bold text-card-foreground">R$ 5.600</h5>
      </div>
      <div className="flex flex-col justify-center h-32 w-full bg-card border border-border rounded-xl p-5">
        <h6 className="text-secondary-foreground/80 uppercase text-sm">Despesas</h6>
        <h5 className="text-xl font-bold text-card-foreground">R$ 5.600</h5>
      </div>
    </section>
    <section>
      <aside className="min-h-80 max-h-100 w-full rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-6 mt-5">
        <header className='space-y-0.5'>
          <h5 className="text-card-foreground font-bold text-md">Maiores gastos</h5>
          <p className="text-secondary-foreground/80 text-sm">Neste mês</p>
        </header>

        <main className="mt-5">
          <div className="w-full h-56 flex flex-col space-y-8 justify-center">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row justify-between">
                <span className="flex flex-row items-center gap-3">
                  <div
                    className="h-4 w-4 bg-yellow-500 rounded-full"
                  />
                  <h6 className="text-sm font-bold text-card-foreground">Morada</h6>
                </span>
                <span>
                  <h6 className="text-sm font-bold text-card-foreground">R$ 1.400</h6>
                </span>
              </div>
              <div>
                <div className="w-full h-2.5 bg-secondary rounded-full">
                  <div className="bg-yellow-500 h-full w-[50%] rounded-full" />
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-row justify-between">
                <span className="flex flex-row items-center gap-3">
                  <div
                    className="h-4 w-4 bg-blue-500 rounded-full"
                  />
                  <h6 className="text-sm font-bold text-card-foreground">Alimentação</h6>
                </span>
                <span>
                  <h6 className="text-sm font-bold text-card-foreground">R$ 832</h6>
                </span>
              </div>
              <div>
                <div className="w-full h-2.5 bg-secondary rounded-full">
                  <div className="bg-blue-500 h-full w-[25%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <a className="flex flex-row items-end gap-2 text-primary/90 text-sm font-medium mt-5">Ver todos <MoveRight /></a>
        </main>
      </aside>
    </section>
    {/* Wallets */}
    <div className="h-fit w-full mt-7">
      <h5 className="text-foreground font-bold">
        Suas carteiras
      </h5>
      <h6 className="text-secondary-foreground/80 text-sm">Acompanhe seus saldos e suas metas</h6>
      <section className="grid lg:grid-cols-3 grid-rows-1 mt-7 place-items-center space-y-5 md:grid-cols-2 grid-cols-1 md:gap-10">
        <WalletComponent
          walletData={{
            name: "Conta",
            amountCents: BigInt(100000),
            createdAt: new Date(),
            currency: "BRL",
            id: "12341234",
            type: "MAIN",
            category: "Corrente",
            userId: auth?.user?.id || "dsadhajdajkdha",
            lastTransaction: {
              walletId: "12341234",
              amountCents: BigInt(3050),
              category: "Compra",
              date: new Date(),
              isPaid: true,
              type: "dsadasd",
              id: "compra-123",
            }
          }}
        />
        {/* <article className="min-h-82 w-96">
          <div className="flex flex-col flex-1 bg-card border border-border  rounded-xl p-6 shadow-md/20">
            <header className="flex flex-row items-center justify-between">
              <span className="text-primary bg-border p-3 rounded-lg">
                <TrendingUp size={24} />
              </span>
              <span className="mr-5">
                <div className="size-2.5 bg-primary rounded-full" />
              </span>
            </header>
            <section className="mt-5">
              <span className="space-y-2">
                <h4 className="font-bold text-lg">Investimentos</h4>
                <span className="flex justify-center items-center min-w-20 w-fit max-w-36 bg-border text-xs font-medium py-1.5 px-2.5 rounded-full text-primary">
                  <p>Crescimento</p>
                </span>
              </span>

              <div className="mt-3">
                <h4 className="text-foreground text-2xl font-bold">R$ 1.400</h4>
                <h6 className="text-secondary-foreground/80 text-sm">Saldo disponível</h6>
              </div>
              <div className="relative bottom-4 h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { valor: 0 },
                    { valor: 110 },
                    { valor: 220 },
                    { valor: 560 },
                    { valor: 560 },
                    { valor: 110 },
                    { valor: 220 },
                    { valor: 560 },
                    { valor: 560 },
                  ]}>
                    <Area
                      type="linear"
                      dataKey="valor"
                      stroke="#4ade80"
                      strokeWidth={2}
                      fillOpacity="0"
                      activeDot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
            <div
              className="h-0.5 w-full bg-border my-2"
            />
            <footer className="h-10 w-full mt-5">
              <h6 className="text-xs text-secondary-foreground/90">Última transação</h6>
              <p className="text-sm text-foreground/90">R$ 250,00 - Transferência</p>
            </footer>
          </div>
          <span className="text-primary w-fit h-fit ">
            <a className="mt-6 ml-6 text-sm flex flex-row items-center gap-3">Ver detalhes <MoveRight size={20} /></a>
          </span>
        </article>
        <article className="h-101 w-96">
          <div className="flex flex-col h-full bg-card border border-border  rounded-xl p-6 shadow-md/20">
            <header className="flex flex-row items-center justify-between">
              <span className="text-yellow-400 bg-border p-3 rounded-lg">
                <Sparkle />
              </span>
              <span className="mr-5">
                <div className="size-2.5 bg-yellow-400 rounded-full" />
              </span>
            </header>
            <div className="mt-5">
              <span className="space-y-2">
                <h4 className="font-bold text-lg">Viagem Japão</h4>
                <span className="flex justify-center items-center min-w-5 w-fit max-w-36 bg-yellow-900 text-xs font-medium py-1.5 px-2.5 rounded-full text-yellow-300">
                  <p>Meta</p>
                </span>
              </span>

              <div className="mt-3 flex flex-row items-end space-x-3">
                <h4 className="text-foreground text-2xl font-bold">R$ 1.400</h4>
                <h6 className="text-secondary-foreground/80 text-xs mb-0.5">de R$ 2.500</h6>
              </div>
            </div>
            <div className="mt-5 mb-3 space-y-3">
              <div
                className="w-full h-3 bg-border rounded-full"
              >
                <div className="bg-yellow-400 w-[56%] h-full rounded-full" />
              </div>
              <div className="w-full flex flex-row justify-between">
                <span className="text-xs">56% completo</span>
                <span className="text-xs">faltam R$ 1.100</span>
              </div>
            </div>
            <div
              className="h-0.5 w-full bg-border my-2"
            />
            <footer className="h-10 w-full mt-5">
              <h6 className="text-xs text-secondary-foreground/90">Última transação</h6>
              <p className="text-sm text-foreground/90">R$ 250,00 - Transferência</p>
            </footer>
          </div>
          <span className="text-primary w-fit h-fit ">
            <Link to="/wallet/$walletId" params={{ walletId: "1" }} className="mt-6 ml-6 text-sm flex flex-row items-center gap-3">Ver detalhes <MoveRight size={20} /></Link>
          </span>
        </article> */}
      </section>
    </div>
  </div>
}
