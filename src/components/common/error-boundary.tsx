import { Component, ErrorInfo, ReactNode } from "react"
// Modified version of this: https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
interface Props {
  children?: ReactNode
  fallbackUI?: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallbackUI ?? <h1>Sorry.. there was an error</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary
