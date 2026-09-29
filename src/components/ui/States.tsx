import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return <div className="state-panel"><span className="spinner" />{label}</div>
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="state-panel"><strong>{title}</strong><span>{description}</span>{action}</div>
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return <div className="state-panel state-error"><strong>We couldn't load this data.</strong><span>Check your connection and try again.</span><button className="text-button" onClick={onRetry}>Try again</button></div>
}
