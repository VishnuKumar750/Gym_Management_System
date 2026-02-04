import { Outlet } from "react-router-dom";
import { Navbar } from "../navbar";

export default function LandingLayout() {
  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Navbar - full width with container inside */}
      <Navbar />
      {/* Main content - centered with max-width */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <Outlet />
        </div>
      </main>
      {/* Very minimal footer */}
      <footer className="border-t border-slate-100 dark:border-card py-12 bg-slate-50/50 dark:bg-background">
        <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} GymFlow • Made for gyms that value
          clarity
        </div>
      </footer>
    </div>
  );
}
