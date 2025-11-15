
import AppSideBar from "../AppSideBar";
import Dropdown from "../Dropdown";
import { Dumbbell } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex w-full">
        <AppSideBar />
        <SidebarInset className="flex-1">
          <header className="border-b border-neutral-700/20 flex items-center justify-between gap-2 p-4 dark:bg-neutral-800">
            <SidebarTrigger className="dark:text-white" />
            <h1 className="flex items-center gap-2 text-lg font-semibold dark:text-white">
              <Dumbbell className="w-6 h-6" />
              GymShark
            </h1>
            <Dropdown />
          </header>

          <main className="container mx-auto flex-1 p-4 dark:bg-neutral-800">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
