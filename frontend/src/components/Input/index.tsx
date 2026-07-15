import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  label?: string
  showPasswordToggle?: boolean
}

function Label({ error, children, ...props }: { error?: boolean } & React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={twMerge("block text-xs text-muted-foreground mb-2 tracking-wider uppercase", error && "text-red-400")} style={{ fontFamily: "DM Mono, monospace" }}
    >
      {children}
    </label>
  )
}


export function Input({ error, label, showPasswordToggle, ...props }: InputProps) {
  const [showPw, setShowPw] = useState(showPasswordToggle)

  return (
    <span className="space-y-2">
      {label && <Label error={!!error}>{label}</Label>}
      <span className="relative block">
        <input
          {...props}
          type="text"
          className={twMerge(
            "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground",
            error && "border-red-900 bg-red-950/30"
          )}
        />
        {props.type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className={twMerge("absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/80 transition-colors", error && "text-red-700 hover:text-red-600")}
          >
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </span>

      {error && (
        <p className='text-red-200 bg-red-500/40 rounded-2xl px-4 py-3 overflow-hidden wrap-break-word'>{error}</p>
      )}
    </span>
  )
}
