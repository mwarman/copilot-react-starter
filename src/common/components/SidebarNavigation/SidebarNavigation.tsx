import { filter, map } from "lodash";
import { House, ScrollText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  useSidebar,
} from "../Sidebar/Sidebar";
import { Link } from "react-router-dom";
import { cn } from "@/common/utils/css";
import logo from "@/assets/react.svg";

type MenuItem = {
  group: string;
  label: string;
  link: string;
  icon?: React.ComponentType;
  testId?: string;
  items?: MenuItem[];
};

const SidebarNavigation = () => {
  const { open } = useSidebar();

  const menuItems: MenuItem[] = [
    {
      group: "Application",
      label: "Home",
      link: "/",
      icon: House,
      testId: "home-link",
    },
    {
      group: "Application",
      label: "Documentation",
      link: "/documentation",
      icon: ScrollText,
      testId: "documentation-link",
      items: [
        {
          group: "Application",
          label: "Introduction",
          link: "/documentation/introduction",
          testId: "documentation-introduction-link",
        },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-slate-800 dark:border-slate-700/75">
      <SidebarHeader className={cn("h-17 justify-center")}>
        <div className={cn("flex items-center gap-2")}>
          <img src={logo} alt="React Starter Kit Logo" className="size-8" />
          <div
            className={cn(
              "font-bold text-lg w-full transition-[width] duration-200 ease-linear overflow-hidden text-nowrap",
              {
                "w-0": !open,
              }
            )}
          >
            React Starter Kit
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {map(filter(menuItems, { group: "Application" }), (item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.link} data-testid={item.testId}>
                      {item?.icon && <item.icon />}
                      {item.label}
                    </Link>
                  </SidebarMenuButton>
                  {map(item.items, (subItem) => (
                    <SidebarMenuSub key={subItem.label}>
                      <SidebarMenuSubButton asChild>
                        <Link to={subItem.link} data-testid={subItem.testId}>
                          {subItem?.icon && <subItem.icon />}
                          {subItem.label}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSub>
                  ))}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarNavigation;
