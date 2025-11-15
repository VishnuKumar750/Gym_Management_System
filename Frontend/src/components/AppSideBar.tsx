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


const SideBarItems = [
  {
    icon: <Home className="size-5" />,
    title: "Dashboard",
    access: 'admin',
  },
  {
    icon: <User className="size-5" />,
    title: "Members",
    access: 'admin',
  },
  {
    icon: <ReceiptText className="size-5" />,
    title: "Bill",
    access: 'member',
  },
  {
    icon: <Bell className="size-5" />,
    title: "Notification",
    access: 'member',
  },
  {
    icon: <Bug className="size-5" />,
    title: "Report",
    access: 'admin',
  },
]

export default function AppSideBar() {
  const role = 'member';

  const filteredItems = SideBarItems.filter((item) => {
    if(!item.access) return true;

    return item.access === role;
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
                <SidebarMenuButton>
                  {item.icon}
                  <span className="sidebar-label">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
