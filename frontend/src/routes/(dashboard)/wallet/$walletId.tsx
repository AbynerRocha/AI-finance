import { getUserWallet } from '#/services/wallet/index.ts';
import { formatMoney } from '#/utils/formatCurrency.ts';
import { createFileRoute, redirect } from '@tanstack/react-router'
import { AxiosError } from 'axios';
import { ArrowUp, Minus, MoveDown, MoveRight, MoveUp, Plus, Wallet2 } from 'lucide-react';
import { div } from 'motion/react-client';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

export const Route = createFileRoute('/(dashboard)/wallet/$walletId')({
  loader: {
    handler: async ({ params, context }) => {
      try {
        const wallet = await getUserWallet(params.walletId)

        return wallet
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
          }
        }
      }
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const wallet = Route.useLoaderData()

  if (!wallet) {
    return <h1>404</h1>
  }

  return <div className='flex flex-col flex-1 mt-4 px-14'>
    <section className="flex flex-row justify-between p-4 w-full h-48 bg-card border border-border rounded-lg shadow-md/20">
      <div className="flex flex-col pt-1 px-3 h-full w-148 space-y-3">
        <div className="space-y-2">
          <div>
            <header className="flex flex-row items-center justify-between">
              <div className="flex flex-row space-x-4">
                <span className="text-primary bg-border p-3 rounded-lg h-12 w-12 ">
                  <Wallet2 />
                </span>
                <span className="space-y-1">
                  <h4 className="font-bold text-lg">Reserva de Emergência</h4>
                  <span className="flex justify-center items-center min-w-20 w-fit max-w-36 bg-border text-xs font-medium py-1.5 px-2.5 rounded-full text-primary overflow-hidden">
                    <p>Segurança</p>
                  </span>
                </span>
              </div>
              <span className="mr-5">
                <div className="size-2.5 bg-card rounded-full" />
              </span>
            </header>
          </div>
          <div className="flex flex-row items-end gap-2 mt-5">
            <h4 className="text-card-foreground text-4xl font-bold">
              R$ 24.534,00
            </h4>
            <span className="bg-secondary py-1 px-4 rounded-full flex items-center w-36">
              <span className="flex flex-row items-center text-primary gap-1">
                <ArrowUp size={14} />
                <p className="text-xs">8.4% neste mês</p>
              </span>
            </span>
          </div>
          <p className="text-secondary-foreground/70 text-sm font-medium">Saldo atual</p>
        </div>

      </div>
      <div className="flex flex-1 items-center space-x-3 justify-end px-6 pt-1">
        <button
          className="bg-accent text-accent-foreground h-12 rounded-lg w-36 text-sm font-bold flex items-center justify-center gap-1 cursor-pointer active:bg-accent hover:bg-accent/90"
        >
          <Plus size={20} />
          Adicionar
        </button>
        <button
          className="bg-secondary text-card-foreground border border-border h-12 rounded-lg w-36 text-sm font-bold flex items-center justify-center gap-1 cursor-pointer active:bg-secondary hover:bg-secondary/40"
        >
          <Minus size={20} />
          Retirar
        </button>
      </div>
    </section>
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] mt-10 ">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-6">
          <header>
            <span>
              <h5 className='text-card-foreground text-sm font-medium'>Evolução de saldo</h5>
              <p className="text-xs text-secondary-foreground/80">Acompanhe a evolução do saldo da sua carteira</p>
            </span>
            <span>

            </span>
          </header>
          <main className="w-full h-full px-5 py-4 flex items-center justify-center">
            <ResponsiveContainer width="95%" height="95%">
              <AreaChart data={[
                { valor: 100, mes: "fev" },
                { valor: 110, mes: "mar" },
                { valor: 220, mes: "abr" },
                { valor: 560, mes: "maio" },
                { valor: 560, mes: "jun" },
                { valor: 110, mes: "jul" },
                { valor: 220, mes: "ago" },
                { valor: 560, mes: "set" },
                { valor: 560, mes: "out" },
              ]}>
                <XAxis
                  dataKey="mes"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={20}
                  interval={"preserveStartEnd"}
                  tick={{
                    fill: "#4ade80",
                    fontSize: 12,
                  }}
                />
                <YAxis hide dataKey="valor" />
                <Area
                  type="linear"
                  dataKey="valor"
                  stroke="#4ade80"
                  fill="#4ade80"
                  strokeWidth={3}
                  fillOpacity="0.08"
                  dot
                />
              </AreaChart>
            </ResponsiveContainer>
          </main>
        </div>

        <aside className="min-h-80 max-h-100 rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-6">
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

      {/* Movimentações */}
      <section className="flex flex-col min-h-32 overflow-x-auto mb-10 rounded-xl border border-border bg-card p-4 sm:rounded-2xl sm:p-6">
        <header className='space-y-0.5'>
          <h5 className="text-card-foreground font-bold text-md">Movimentações recentes</h5>
          <p className="text-secondary-foreground/80 text-sm">Últimas entradas e saídas desta carteira.</p>
        </header>
        <main className="mt-4 overflow-hidden rounded-lg">
          <table className="w-full table-fixed">
            <thead className="bg-muted/30">
              <tr>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                      <MoveDown size={16} className="text-primary" />
                    </span>
                    <span className="flex flex-col justify-center">
                      <h6 className="text-sm font-bold">Aporte mensal</h6>
                      <p className="text-xs text-secondary-foreground/90">08 jul 2026</p>
                    </span>
                  </div>
                </td>
                <td className="flex flex-1 items-center justify-center px-4 py-3 text-sm font-semibold text-primary">+ R$ 500,00</td>
              </tr>
              <tr className="border-t border-border">
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-900/50">
                      <MoveUp size={16} className="text-red-200" />
                    </span>
                    <span className="flex flex-col justify-center">
                      <h6 className="text-sm font-bold">Transferência</h6>
                      <p className="text-xs text-secondary-foreground/90">07 jul 2026</p>
                    </span>
                  </div>
                </td>
                <td className="flex flex-1 items-center justify-center px-4 py-3 text-sm font-semibold text-red-400">- R$ 125,00</td>
              </tr>
            </tbody>
          </table>
        </main>
        <footer className="w-full flex justify-end">
          <a className="flex flex-row items-end gap-2 text-primary/90 text-sm font-medium mt-5">Ver todos <MoveRight /></a>
        </footer>
      </section>
    </div>
  </div>
}
