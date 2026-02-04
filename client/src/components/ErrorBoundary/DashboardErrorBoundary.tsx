// Improved DashboardErrorBoundary with reset support
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface DashboardErrorBoundaryProps {
  error?: Error
  resetErrorBoundary?: () => void
}

export default function DashboardErrorBoundary({
  error,
  resetErrorBoundary,
}: DashboardErrorBoundaryProps = {}) {
  return (
    <div className="p-8 text-center space-y-6">
      <Alert variant="destructive">
        <AlertTitle>Dashboard section failed to load</AlertTitle>
        <AlertDescription>
          Some features are currently unavailable. Our team has been notified.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={resetErrorBoundary} variant="default">
          Try Again
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      </div>

      {/* Optional: show error in development */}
      {import.meta.env.DEV && error && (
        <pre className="mt-6 p-4 bg-destructive/10 rounded text-sm text-left overflow-auto max-h-60">
          {error.message}
          {"\n\n"}
          {error.stack}
        </pre>
      )}
    </div>
  )
}