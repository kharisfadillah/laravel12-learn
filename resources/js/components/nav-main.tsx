import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Stethoscope } from 'lucide-react';

export function NavMain({ masterItems = [], userManagementItems = [] }: { masterItems: NavItem[]; userManagementItems: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                <SidebarMenuItem key="Dashboard">
                    <SidebarMenuButton asChild isActive={page.url.startsWith('/dashboard')} tooltip={{ children: 'Dashboard' }}>
                        <Link href="/dashboard" prefetch>
                            <LayoutGrid />
                            <span>Dashboard</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem key="Medical Check Up">
                    <SidebarMenuButton asChild isActive={page.url === '/mcu'} tooltip={{ children: 'Medical Check Up' }}>
                        <Link href="/mcu" prefetch>
                            <Stethoscope />
                            <span>Medical Check Up</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarGroupLabel>Master</SidebarGroupLabel>
            <SidebarMenu>
                {masterItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
            <SidebarMenu>
                {userManagementItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
