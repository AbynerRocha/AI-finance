import type { WalletData } from "#/schemas/wallet/index.ts";
import { formatMoney, toFloat } from "#/utils/formatCurrency.ts";
import { Link } from "@tanstack/react-router";
import { MoveRight, PiggyBank } from "lucide-react";
import type React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type WalletComponentProps = {
  icon?: React.ReactNode,
  walletData: WalletData
}

export default function WalletComponent({ walletData, icon }: WalletComponentProps) {

  return (
    <article className="h- w-80 md:min-h-82 md:w-96">
      <div className="flex flex-col flex-1 bg-card border border-border  rounded-xl p-6 shadow-md/20">
        <header className="flex flex-row items-center justify-between">
          <span className="text-primary bg-border p-3 rounded-lg">
            <PiggyBank size={24} />
          </span>
          <span className="mr-5">
            <div className="size-2.5 bg-primary rounded-full" />
          </span>
        </header>
        <section className="mt-5">
          <span className="space-y-2">
            <h4 className="font-bold text-lg">{walletData.name}</h4>
            <span className="flex justify-center items-center min-w-20 w-fit max-w-36 bg-border text-xs font-medium py-1.5 px-2.5 rounded-full text-primary overflow-hidden">
              <p>{walletData.category}</p>
            </span>
          </span>

          <div className="mt-3">
            <h4 className="text-foreground text-2xl font-bold">{formatMoney(walletData.amountCents, walletData.currency)}</h4>
            <h6 className="text-secondary-foreground/80 text-sm">Saldo disponível</h6>
          </div>
          <div className="relative bottom-4 h-20 w-full mt-3 lg:mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[{ valor: 1000 }, { valor: 1200 }, { valor: 490 }, { valor: 2000 }]}>
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
          {walletData.lastTransaction && (<>
            <h6 className="text-xs text-secondary-foreground/90">Última transação</h6>
            <p className="text-sm text-foreground/90">{formatMoney(walletData.lastTransaction?.amountCents)}</p>
          </>)}
        </footer>
      </div>
      <span className="text-primary w-fit h-fit ">
        <Link
          className="mt-6 ml-6 text-sm flex flex-row items-center gap-3"
          to="/wallet/$walletId"
          params={{ 
            walletId: walletData.id
          }}
        >
          Ver detalhes <MoveRight size={20} />
        </Link>
      </span>
    </article>
  )
}
