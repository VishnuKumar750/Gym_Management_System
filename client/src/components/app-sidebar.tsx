import {
  IconDashboard,
  IconUsers,
  IconMoneybag,
  IconBell,
  IconBuildingStore,
  IconCookie,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

// ── Define role-based navigation ─────────────────────────────────────
const getNavItems = (role: string) => {
  const noramlizeRole = role?.toLowerCase();

  switch (noramlizeRole) {
    case "admin":
      return {
        main: [
          {
            title: "Dashboard",
            url: "/admin/",
            icon: IconDashboard,
          },
          {
            title: "Members",
            url: "/admin/members",
            icon: IconUsers,
          },
          {
            title: "Staffs",
            url: "/admin/staffs",
            icon: IconUsers,
          },
          {
            title: "Billing & Fees",
            url: "/admin/billing",
            icon: IconMoneybag,
            items: [
              { title: "Bills", url: "/admin/billing/list" },
              { title: "Fee Packages", url: "/admin/packages" },
            ],
          },
          {
            title: "Notifications",
            url: "/admin/notifications",
            icon: IconBell,
          },
          {
            title: "Supplement Store",
            url: "/admin/supplement",
            icon: IconBuildingStore,
          },
          {
            title: "Diet Plans",
            url: "/admin/diets",
            icon: IconCookie,
          },
        ],
      };

    case "staff":
      return {
        main: [
          {
            title: "Dashboard",
            url: "/staff",
            icon: IconDashboard,
          },
          {
            title: "Members",
            url: "/staff/members",
            icon: IconUsers,
          },
        ],
      };

    case "member":
    default:
      return {
        main: [
          {
            title: "Dashboard",
            url: "/member/",
            icon: IconDashboard,
          },
          {
            title: "Bill Receipts",
            url: "/member/bill-reciepts",
            icon: IconMoneybag,
          },
          {
            title: "Notifications",
            url: "/member/bill-notification",
            icon: IconBell,
          },
        ],
      };
  }
};

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const role = user?.role ?? "";

  const { main } = getNavItems(role);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <span className="text-xl font-bold">GymShark</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={main} />
      </SidebarContent>
    </Sidebar>
  );
}
