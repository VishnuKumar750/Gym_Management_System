import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  Home,
  Dumbbell,
  ReceiptText,
  Bell,
  User,
  Bug,
} from "lucide-react";
import { useAuth } from "./context/Auth";
import { Link } from "react-router-dom";


const SideBarItems = [
  {
    icon: <Home className="size-5" />,
    title: "Dashboard",
    access: 'admin',
    link: "/",
  },
  {
    icon: <User className="size-5" />,
    title: "Members",
    access: 'admin',
    link: "/members", 
  },
  {
    icon: <ReceiptText className="size-5" />,
    title: "Bill",
    access: 'member',
    link: "/bill",
  },
  {
    icon: <Bell className="size-5" />,
    title: "Notification",
    access: 'member',
    link: "/Notification"
  },
  {
    icon: <Bug className="size-5" />,
    title: "Report",
    access: 'admin',
    link: "/Report", 
  },
]

export default function AppSideBar() {
  const { user } = useAuth();

  const filteredItems = SideBarItems.filter((item) => {
    if(!item.access) return true;

    return item.access === user?.role;
  })

  return (
    <Sidebar collapsible="icon" className="border-none">
      {/* HEADER */}
      <SidebarHeader className="flex items-center gap-2 px-3 py-4 dark:text-white">
        <Dumbbell className="w-6 h-6 " />
        <span className="sidebar-label font-semibold ">GymShark</span>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-label">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>

            {filteredItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                  <Link to={item.link}>
                <SidebarMenuButton>
                    {item.icon}
                    <span className="sidebar-label">{item.title}</span>
                </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
            ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
