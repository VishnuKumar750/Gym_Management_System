

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
    <h1 className="text-8xl font-bold text-primary">404</h1>
    <p className="mt-4 text-2xl font-semibold">Page not found</p>
    <p className="mt-2 text-muted-foreground max-w-md">
      The page you are looking for might have been removed, had its name changed,
      or is temporarily unavailable.
    </p>
    <a
      href="/"
      className="mt-8 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
    >
      Go back to Home
    </a>
  </div>
	)
}

export default NotFound;