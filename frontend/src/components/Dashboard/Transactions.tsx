
import { formatMoney } from '#/utils/formatCurrency.ts';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import type { Transaction } from '../../../types/transactions';

type TransactionsProps = {
  transactions: Transaction[]
}

export default function Transactions({ transactions }: TransactionsProps) {
  return (
    <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div>
          <p className="text-sm font-medium text-foreground">Últimas transações</p>
          <p className="text-xs text-muted-foreground">Julho 2026</p>
        </div>
        <button className="text-xs text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
          Ver todas <ChevronRight size={12} />
        </button>
      </div>
      <div className="space-y-0.5">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tx.type === "credit" ? "bg-primary/10" : "bg-secondary"}`}>
              {tx.icon ? <tx.icon size={14} className={tx.type === "credit" ? "text-primary" : "text-muted-foreground"} /> : 
                tx.type === 'credit' ? <TrendingUp size={14} className='text-primary' /> : <TrendingDown size={14} className='text-muted-foreground' />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{tx.desc}</p>
              <p className="text-xs text-muted-foreground">{tx.date}</p>
            </div>
            <span
              className={`text-xs sm:text-sm font-medium shrink-0 ${tx.type === "credit" ? "text-primary" : "text-foreground"}`}
              style={{ fontFamily: "DM Mono, monospace" }}
            >
              {tx.type === "credit" ? "+" : ""}{formatMoney(tx.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

