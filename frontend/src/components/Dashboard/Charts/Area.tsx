import { formatMoney } from "#/utils/formatCurrency.ts";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AreaChartComponentProps ={
  balanceHistory: {
    month: string,
    balance: number
  }[]
}

export default function AreaChartComponent({ balanceHistory }: AreaChartComponentProps) {
  return (
    <div className="md:col-span-2 bg-card border border-border rounded-xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <p className="text-sm font-medium text-foreground">Evolução do saldo</p>
          <p className="text-xs text-muted-foreground">Últimos 7 meses</p>
        </div>
        <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-md" style={{ fontFamily: "DM Mono, monospace" }}>
          +60% YTD
        </span>
      </div>
      {/* Mobile: taller chart, no Y axis */}
      <div className="block md:hidden">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={balanceHistory} margin={{ top: 4, right: 4, left: -32, bottom: 0 }}>
            <defs>
              <linearGradient id="balGradMob" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ef08a" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5ef08a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b9478", fontSize: 11, fontFamily: "DM Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 12 }}
              formatter={(v) => [formatMoney(parseInt(v?.toString() || '0')), "Balance"]}
            />
            <Area type="monotone" dataKey="balance" stroke="#5ef08a" strokeWidth={2.5} fill="url(#balGradMob)" dot={false} activeDot={{ r: 5, fill: "#5ef08a" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Desktop: standard */}
      <div className="hidden md:block">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={balanceHistory} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ef08a" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#5ef08a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b9478", fontSize: 10, fontFamily: "DM Mono, monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b9478", fontSize: 9, fontFamily: "DM Mono, monospace" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 12 }}
              formatter={(v) => [formatMoney(parseInt(v?.toString() || '0')), "Balance"]}
            />
            <Area type="monotone" dataKey="balance" stroke="#5ef08a" strokeWidth={2} fill="url(#balGrad)" dot={false} activeDot={{ r: 4, fill: "#5ef08a" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

