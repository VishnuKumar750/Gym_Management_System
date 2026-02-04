import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="w-full border-b bg-background ">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo / Title */}
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Gymshark
        </Link>

        {/* Action */}
        <Button asChild size="sm">
          <Link to="/signin">Dashboard</Link>
        </Button>
      </div>
    </header>
  );
}
