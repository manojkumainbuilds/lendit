
import { useState, type FormEvent } from 'react'
import { login } from '../services/authService'
import type { AuthUser } from '../services/authService'

interface LoginPageProps {
  onAuthenticated: (user: AuthUser) => void
}

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const user = await login(username.trim(), password)
      setPassword('')
      onAuthenticated(user)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">

        <p className="eyebrow">LENDIT · LENDING MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="page-subtitle">
          Sign in to access your lending workspace.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username or email</label>
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="login-footnote">
          Secured by Manoj Kumain.
        </p>
      </section>
    </main>
  )
}
