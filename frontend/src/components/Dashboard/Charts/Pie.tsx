import { formatMoney } from '#/utils/formatCurrency.ts';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

type PieChartComponentProps = {
  spendingData: {
    name: string,
    value: number,
    color?: string
  }[]
}

export default function PieChartComponent({ spendingData }: PieChartComponentProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5">
      <p className="text-sm font-medium text-foreground mb-1">Gastos por categoria</p>
      <p className="text-xs text-muted-foreground mb-3">Julho 2026</p>
      {/* Mobile: pie larger, legend below */}
      <div className="flex flex-col items-center gap-4 md:hidden">
        <PieChart width={180} height={180}>
          <Pie data={spendingData} cx={90} cy={90} innerRadius={52} outerRadius={80} paddingAngle={2} dataKey="value">
            {spendingData.map((data, i) => (
              <Cell key={`cell-mob-${i}`} fill={data.color ? data.color : "#5ef08a"} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 11 }}
            formatter={(v) => [formatMoney(parseInt(v?.toString() || '0')), "Saldo"]}
          />
        </PieChart>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full px-2">
          {spendingData.map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-xs text-muted-foreground truncate">{d.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Desktop: pie + legend side by side */}
      <div className="hidden md:flex items-center gap-4">
        <div className="shrink-0">
          <PieChart width={120} height={120}>
            <Pie data={spendingData} cx={60} cy={60} innerRadius={36} outerRadius={54} paddingAngle={2} dataKey="value">
              {spendingData.map((data, i) => (
                <Cell key={`cell-${i}`} fill={data.color ? data.color : "#5ef08a"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#112418", border: "1px solid rgba(94,240,138,0.15)", borderRadius: 8, color: "#e8f0e9", fontSize: 11 }}
              formatter={(v) => [formatMoney(parseInt(v?.toString() || '0')), "Saldo"]}
            />
          </PieChart>
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          {spendingData.map((d) => (
            <div key={d.name} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="text-xs text-muted-foreground truncate">{d.name}</span>
              </div>
              <span className="text-xs shrink-0" style={{ fontFamily: "DM Mono, monospace", color: d.color ? d.color : "#5ef08a"}}>
                {formatMoney(d.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
