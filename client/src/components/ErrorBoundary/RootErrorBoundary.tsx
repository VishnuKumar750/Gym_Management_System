import { Button } from "@/components/ui/button"
// Optional: better fallback typing + loading state handling
interface RootErrorBoundaryProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function RootErrorBoundary({
  error,
  resetErrorBoundary,
}: RootErrorBoundaryProps) {
  return (
    <div className="min-h-screen grid place-items-center bg-background p-4">
      <div className="text-center space-y-8 max-w-lg">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-destructive">Critical Error</h1>
          <p className="text-lg text-muted-foreground">
            We're sorry — something went seriously wrong.
          </p>
        </div>

        {import.meta.env.DEV && error && (
          <div className="w-full max-w-2xl mx-auto">
            <details className="text-left text-sm bg-muted p-4 rounded border">
              <summary className="cursor-pointer font-medium">Show error details (dev only)</summary>
              <pre className="mt-3 overflow-auto text-destructive/90 whitespace-pre-wrap">
                {error.message}
                {"\n\n"}
                {error.stack}
              </pre>
            </details>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => window.location.reload()}>
            Reload Application
          </Button>

          {resetErrorBoundary && (
            <Button variant="outline" size="lg" onClick={resetErrorBoundary}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}