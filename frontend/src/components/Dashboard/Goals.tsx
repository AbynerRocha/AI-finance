import { formatMoney } from '#/utils/formatCurrency'
import { Target } from 'lucide-react';
import type { GoalType } from '../../../types/goals';


type GoalsProps = {
  goals: GoalType[]
}

export function Goals({ goals }: GoalsProps) {
  goals[0].current

  return (
    <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4 md:p-5">
      <div className="flex items-center justify-between mb-4 md:mb-5">
        <div>
          <p className="text-sm font-medium text-foreground">Metas financeiras</p>
          <p className="text-xs text-muted-foreground">3 em progresso</p>
        </div>
        <Target size={16} className="text-muted-foreground" />
      </div>
      <div className="space-y-4 md:space-y-5">
        {goals.map((g) => {
          const porcentage = Math.round((g.current / g.goal) * 100);

          return (
            <div key={g.label}>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-foreground">{g.label}</p>
                <span className="text-xs" style={{ fontFamily: "DM Mono, monospace", color: g.color }}>
                  {porcentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${porcentage}%`, background: g.color }}
                />
              </div>
              <div className="flex items-center justify-between mt-1" style={{ fontFamily: "DM Mono, monospace" }}>
                <span className="text-xs text-muted-foreground">
                  {formatMoney(g.current)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatMoney(g.goal)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border border-dashed border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/40 transition-colors cursor-pointer group">
        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Nova meta</p>
        <div className="w-6 h-6 rounded-full border border-border group-hover:border-primary group-hover:text-primary flex items-center justify-center text-muted-foreground transition-colors text-xs">
          +
        </div>
      </div>
    </div>
  )
}
