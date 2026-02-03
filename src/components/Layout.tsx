import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Binary } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const AppSidebar = () => {
    const location = useLocation();

    const items = [
        {
            title: "Radix Sort",
            url: "/",
            icon: Binary,
        },
        {
            title: "Comparison Sorts",
            url: "/comparison",
            icon: BarChart3,
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="px-4 py-2">
                    <h2 className="text-xl font-bold">Sort Visualizer</h2>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Algorithms</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                                        <Link to={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 min-w-0 bg-background">
                    <div className="p-4">
                        <SidebarTrigger />
                    </div>
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};
