import WalletComponent from '#/components/Dashboard/WalletComponent.tsx';
import { createFileRoute } from '@tanstack/react-router'
import { Sparkle, ArrowUp, MoveRight, PiggyBank, Plus, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export const Route = createFileRoute('/(dashboard)/dashboard/wallets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='flex flex-col flex-1 mt-4 px-14'>
    <div className="flex flex-row justify-between p-4 w-full h-36 bg-card border border-border rounded-lg shadow-md/20">
      <div className="flex flex-col pt-1 px-3 h-full w-148 space-y-3">
        <div className="space-y-3">
          <h6 className="text-secondary-foreground uppercase text-xs">Patrimônio Total</h6>
          <h4 className="text-card-foreground text-4xl font-bold">
            R$ 24.534,00
          </h4>
        </div>
        <span className="bg-secondary py-1 px-4 rounded-full flex items-center w-36">
          <span className="flex flex-row items-center text-primary gap-1">
            <ArrowUp size={14} />
            <p className="text-xs">8.4% neste mês</p>
          </span>
        </span>
      </div>
      <div className="bg-border w-0.5 h-8-" />
      <div className="flex flex-1 items-center justify-between px-6 pt-1">
        <div className="space-y-3">
          <h6 className="text-secondary-foreground text-xs uppercase">Carteiras Ativas</h6>
          <h4 className="text-4xl font-bold">3</h4>
          <p className="text-xs text-secondary-foreground">Você está no controle</p>
        </div>
        <button
          className="bg-accent text-accent-foreground h-12 rounded-lg w-48 text-sm font-bold flex items-center justify-center gap-1 cursor-pointer active:bg-accent hover:bg-accent/90"
        >
          <Plus size={20} />
          Nova carteira
        </button>
      </div>
    </div>
    {/* Wallets */}
    <div className="h-fit w-full mt-7">
      <h5 className="text-foreground font-bold">
        Suas carteiras
      </h5>
      <h6 className="text-secondary-foreground/80 text-sm">Acompanhe seus saldos e suas metas</h6>
      <div className="grid lg:grid-cols-3 grid-rows-1 mt-7 md:grid-cols-2 grid-cols-1 md:gap-10">
        <div className="min-h-82 w-96">
          <div className="flex flex-col flex-1 bg-card border border-border  rounded-xl p-6 shadow-md/20">
            <header className="flex flex-row items-center justify-between">
              <span className="text-primary bg-border p-3 rounded-lg">
                <PiggyBank size={24} />
              </span>
              <span className="mr-5">
                <div className="size-2.5 bg-primary rounded-full" />
              </span>
            </header>
            <div className="mt-5">
              <span className="space-y-2">
                <h4 className="font-bold text-lg">Reserva de Emergência</h4>
                <span className="flex justify-center items-center min-w-20 w-fit max-w-36 bg-border text-xs font-medium py-1.5 px-2.5 rounded-full text-primary overflow-hidden">
                  <p>Segurança</p>
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
            <a className="mt-6 ml-6 text-sm flex flex-row items-center gap-3">Ver detalhes <MoveRight size={20}/></a>
          </span>
        </div>
        <div className="min-h-82 w-96">
          <div className="flex flex-col flex-1 bg-card border border-border  rounded-xl p-6 shadow-md/20">
            <header className="flex flex-row items-center justify-between">
              <span className="text-primary bg-border p-3 rounded-lg">
                <TrendingUp size={24} />
              </span>
              <span className="mr-5">
                <div className="size-2.5 bg-primary rounded-full" />
              </span>
            </header>
            <div className="mt-5">
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
            <a className="mt-6 ml-6 text-sm flex flex-row items-center gap-3">Ver detalhes <MoveRight size={20}/></a>
          </span>
        </div>
        <div className="h-101 w-96">
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
            <a className="mt-6 ml-6 text-sm flex flex-row items-center gap-3">Ver detalhes <MoveRight size={20}/></a>
          </span>
        </div>
      </div>
    </div>
  </div>
}
