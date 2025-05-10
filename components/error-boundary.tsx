"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-black/50 rounded-lg">
            <div className="text-white text-center p-4">
              <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
              <p className="text-sm text-gray-300 mb-4">We couldn't load this component</p>
              {this.state.error && (
                <div className="bg-black/30 p-2 rounded-md max-w-md mx-auto overflow-hidden">
                  <p className="text-xs text-red-300 truncate">{this.state.error.message}</p>
                </div>
              )}
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
