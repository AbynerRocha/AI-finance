import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from '#/components/Logo';
import { registerUser } from '#/services/auth';
import { API_ERROR } from "#/utils/errors"
import { AxiosError } from 'axios';
import type { ApiError } from '../../types/api-error';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod'
import { registerSchema } from '../schemas/user';


export const Route = createFileRoute('/register')({ component: RegisterPage })

// ─── Login ────────────────────────────────────────────────────────────────────

function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ target: string, message: string }[]>([])


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validateFields = await registerSchema.parseAsync({ name, email, password })
      const registered = await registerUser(validateFields)

      if (registered) {
        router.navigate({
          to: "/dashboard",
          replace: true
        })
      }
    } catch (error) {
      handleErrors(error)
    } finally {
      setLoading(false)
    }
  };

  function handleErrors(error: any) {
    if (error instanceof AxiosError) {
      if (error.response?.data) {
        const { error: errorCode, message, issues } = error.response.data as ApiError

        switch (errorCode) {
          case API_ERROR.INVALID_CREDENTIALS: {
            if (!issues) {
              setErrors([{ message, target: 'global' }])
              break
            }

            let errors = []

            for (const issue of issues) {
              errors.push({ target: issue.target, message: "Email ou senha inválida." })
            }

            setErrors(errors)
            break
          }
          default:
            setErrors([{ message, target: 'global' }])
            break
        }
      }
    } else if (error instanceof ZodError) {
      const errorByFields = error.issues.map((err) => ({
        target: err.path[0].toLocaleString(),
        message: err.message
      }))

      setErrors(errorByFields)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row font-[Roboto]">

      {/* Left panel — hidden on mobile, visible lg+ */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] bg-[#071209] p-10 xl:p-14 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/8 blur-2xl" />

        <div className="relative z-10">
          <Logo size={8} />
        </div>

        <div className="relative z-10 max-w-sm">
          <p
            className="text-4xl xl:text-5xl leading-[1.15] text-foreground mb-5"
          >
            Seu dinheiro,{" "}
            <em className="text-primary not-italic">sob controle.</em>
          </p>
          <p className="text-muted-foreground text-sm xl:text-base leading-relaxed">
            Acompanhe gastos, gerencie metas e tome decisões financeiras com clareza e confiança.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-8">
          {[
            { label: "Usuários ativos", value: "84 mil" },
            { label: "Economia média/mês", value: "R$ 1.240" },
            { label: "Metas cumpridas", value: "93%" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xl xl:text-2xl text-primary mb-1" style={{ fontFamily: "DM Mono, monospace" }}>
                {s.value}
              </p>
              <p className="text-muted-foreground text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — full page on mobile */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-5 py-5 border-b border-border">
          <Logo size={8} />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 sm:py-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <h1
                className="text-2xl sm:text-3xl text-foreground mb-2"
              >
                Criar Conta
              </h1>
              <p className="text-muted-foreground text-sm">Preencha os seus dados abaixo para criar a sua conta.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className='space-y-3'>
                <label className={twMerge("block text-xs text-muted-foreground mb-2 tracking-wider uppercase", errors.find(v => v.target === 'password') && "text-red-400")} style={{ fontFamily: "DM Mono, monospace" }}>
                  Nome
                </label>
                <input
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={twMerge(
                    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground",
                    (errors.find(v => v.target === 'name') && "border-red-900 bg-red-950/30")
                  )}
                />

                {errors.filter(v => v.target === 'name').map((err) => {
                  return (
                    <p className='text-red-200 bg-red-500/40 rounded-2xl px-4 py-3 overflow-hidden wrap-break-word'>{err.message}</p>
                  )
                })}
              </div>
              <div className='space-y-3'>
                <label className={twMerge("block text-xs text-muted-foreground mb-2 tracking-wider uppercase", errors.find(v => v.target === 'password') && "text-red-400")} style={{ fontFamily: "DM Mono, monospace" }}>
                  E-mail
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={twMerge(
                    "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground",
                    (errors.find(v => v.target === 'email') && "border-red-900 bg-red-950/30")
                  )}
                />

                {errors.filter(v => v.target === 'email').map((err) => {
                  return (
                    <p className='text-red-200 bg-red-500/40 rounded-2xl px-4 py-3 overflow-hidden wrap-break-word'>{err.message}</p>
                  )
                })}
              </div>

              <div className='space-y-3'>
                <label className={twMerge("block text-xs text-muted-foreground mb-2 tracking-wider uppercase", errors.find(v => v.target === 'password') && "text-red-400")} style={{ fontFamily: "DM Mono, monospace" }}>
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={twMerge(
                      "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all pr-10 placeholder:text-muted-foreground",
                      errors.find((v) => v.target === 'password') && "border-red-900 bg-red-950/30"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.filter(v => v.target === 'password').map((err) => {
                  return (
                    <p className='text-red-200 bg-red-500/40 rounded-2xl px-4 py-3 overflow-hidden wrap-break-word'>{err.message}</p>
                  )
                })}
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Esqueceu a senha?
                  </button>
                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Entrando…
                  </span>
                ) : "Entrar"}
              </button>

              {errors.filter(v => v.target === 'global').map((err) => {
                return (
                  <p className='text-red-200 bg-red-500/40 rounded-2xl px-4 py-3 overflow-hidden wrap-break-word'>{err.message}</p>
                )
              })}

            </form>

            <p className="text-center text-xs text-muted-foreground mt-8">
             Já tem uma conta?{" "}
              <Link to='/login'  className="text-primary hover:text-primary/80 transition-colors font-medium">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

