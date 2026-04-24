import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link, useRouteError, isRouteErrorResponse } from 'react-router'

// ─── React render error boundary (class component) ───────────────────────────
interface BoundaryProps { children?: ReactNode }
interface BoundaryState { hasError: boolean; error: Error | null }

export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Aquí se podría enviar a Sentry, etc.
  }

  render() {
    if (!this.state.hasError) return this.props.children
    return <ErrorUI error={this.state.error} />
  }
}

// ─── React Router route error boundary (functional, usa useRouteError) ────────
export function RouteError() {
  const error = useRouteError()

  let message = 'Ocurrió un error inesperado.'
  let techDetail: string | null = null

  if (isRouteErrorResponse(error)) {
    message = error.status === 404
      ? 'La página que buscas no existe.'
      : `Error ${error.status}: ${error.statusText}`
    techDetail = import.meta.env.DEV ? JSON.stringify(error.data, null, 2) : null
  } else if (error instanceof Error) {
    techDetail = import.meta.env.DEV ? `${error.message}\n${error.stack}` : null
  }

  return <ErrorUI message={message} techDetail={techDetail} />
}

// ─── UI compartida ────────────────────────────────────────────────────────────
function ErrorUI({
  message = 'Ocurrió un error inesperado. Puedes volver al inicio e intentarlo de nuevo.',
  techDetail,
  error,
}: {
  message?: string
  techDetail?: string | null
  error?: Error | null
}) {
  const detail = techDetail ?? (import.meta.env.DEV && error
    ? `${error.message}\n${error.stack}`
    : null)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Algo salió mal</h1>
          <p className="text-gray-500 text-sm">{message}</p>
        </div>

        {detail && (
          <details className="text-left bg-gray-100 rounded-lg p-4 text-xs">
            <summary className="cursor-pointer font-medium text-gray-700 mb-2">
              Detalle técnico (solo visible en desarrollo)
            </summary>
            <pre className="whitespace-pre-wrap text-red-600 overflow-auto">{detail}</pre>
          </details>
        )}

        <Link to="/">
          <button className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  )
}
