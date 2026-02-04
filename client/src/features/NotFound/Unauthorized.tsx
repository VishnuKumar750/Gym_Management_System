const Unauthorized = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
    <h1 className="text-7xl font-bold text-destructive">403</h1>
    <p className="mt-4 text-2xl font-semibold">Access Denied</p>
    <p className="mt-2 text-muted-foreground max-w-md">
      You don't have permission to access this page.
      Please log in with appropriate credentials or contact support.
    </p>
    <div className="mt-8 flex gap-4">
      <a
        href="/login"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
      >
        Login
      </a>
      <a
        href="/"
        className="px-6 py-3 border border-input rounded-lg hover:bg-accent transition"
      >
        Go to Home
      </a>
    </div>
  </div>
		)
}

export default Unauthorized;