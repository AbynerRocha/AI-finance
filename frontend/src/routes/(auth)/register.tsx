import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from "react";
import { Logo } from '#/components/Logo';
import { registerUser } from '#/services/auth';
import { API_ERROR } from "#/utils/errors"
import { AxiosError } from 'axios';
import type { ApiError } from '../../@types/api-error';
import { ZodError } from 'zod'
import { registerSchema } from '../../schemas/user';
import { Input } from '#/components/Input/index.tsx';


export const Route = createFileRoute('/(auth)/register')({
  validateSearch: (search: { redirect?: string } | undefined) => ({
    redirect: search?.redirect ? String(search.redirect) : undefined
  }),
  beforeLoad: async ({ context, search }) => {
    if (context.auth?.isAuthenticated) {
      throw redirect({
        to: search.redirect,
        replace: true
      })
    }
  },
  component: RegisterPage
})

// ─── Login ────────────────────────────────────────────────────────────────────

function RegisterPage() {
  const navigate = Route.useNavigate()
  const { redirect } = Route.useSearch()

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ target: string, message: string }[]>([])


  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      const validateFields = await registerSchema.parseAsync({ name, email, password })
      const registered = await registerUser(validateFields)

      if (registered) {
        navigate({
          to: "/dashboard",
          replace: true,
          search: { redirect }
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
                <Input
                  type="name"
                  label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.find(v => v.target === 'name')?.message}
                />
              </div>
              <div className='space-y-3'>
                <Input
                  type="text"
                  value={email}
                  label="E-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.find(v => v.target === 'email')?.message}
                />
              </div>

              <div className='space-y-3'>
                <Input
                  type='password'
                  label="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.find(v => v.target === 'password')?.message}
                />
                <div className="flex justify-end mt-3">
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
              <Link to='/login' search={{ redirect: redirect ? redirect : "" }} className="text-primary hover:text-primary/80 transition-colors font-medium">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

