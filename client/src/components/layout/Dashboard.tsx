import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import DashboardErrorBoundary from "@/components/ErrorBoundary/DashboardErrorBoundary";

export default function Dashboard() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-background">
        <SiteHeader />
        <div className="w-full  mx-auto p-6">
          <ErrorBoundary FallbackComponent={DashboardErrorBoundary}>
            {<Outlet />}
          </ErrorBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
