
import type { TransactionData } from '#/schemas/transactions/index.ts';
import { formatMoney } from '#/utils/formatCurrency.ts';
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'

type TransactionsProps = {
  transactions: TransactionData[]
}

export default function Transactions({ transactions }: TransactionsProps) {
  return <div></div>
}

