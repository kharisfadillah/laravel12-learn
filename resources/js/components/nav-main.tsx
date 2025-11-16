import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useCan } from '@/hooks/use-can';
import { useMenu } from '@/hooks/use-menu';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Stethoscope } from 'lucide-react';
import { BriefcaseMedical, Building, FileKey, LandPlot, PersonStanding, Tablets, User, UserCog } from 'lucide-react';

const masterItems: NavItem[] = [
    {
        title: 'Unit Usaha',
        href: '/company',
        icon: Building,
        permission: 'view-company',
    },
    {
        title: 'Departemen',
        href: '/department',
        icon: Building,
        permission: 'view-department',
    },
    {
        title: 'Provinsi',
        href: '/province',
        icon: LandPlot,
        permission: 'view-province',
    },
    {
        title: 'Kabupaten',
        href: '/regency',
        icon: LandPlot,
        permission: 'view-regency',
    },
    {
        title: 'Kategori MCU',
        href: '/mcu-category',
        icon: BriefcaseMedical,
        permission: 'view-mcu-category',
    },
    {
        title: 'Parameter MCU',
        href: '/mcu-parameter',
        icon: Tablets,
        permission: 'view-mcu-parameter',
    },
    {
        title: 'Kandidat',
        href: '/participant',
        icon: PersonStanding,
        permission: 'view-participant',
    },
];

const userManagementItems: NavItem[] = [
    {
        title: 'Role',
        href: '/role',
        icon: UserCog,
        permission: 'view-role',
    },
    {
        title: 'Hak Akses',
        href: '/permission',
        icon: FileKey,
        permission: 'view-permission',
    },
    {
        title: 'Pengguna',
        href: '/user',
        icon: User,
        permission: 'view-user',
    },
];

export function NavMain() {
    const page = usePage();
    const can = useCan();
    const isActive = useMenu();

    const masterItemsV = masterItems.filter(item => can(item.permission ?? ''));
    const userManagementItemsV = userManagementItems.filter(item => can(item.permission ?? ''));

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
            {can.any(['mcu-view', 'mcu-create', 'mcu-delete']) &&
                <SidebarMenu>
                    <SidebarMenuItem key="Medical Check Up">
                        <SidebarMenuButton asChild isActive={isActive('/mcu')} tooltip={{ children: 'Medical Check Up' }}>
                            <Link href="/mcu" prefetch>
                                <Stethoscope />
                                <span>Medical Check Up</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            }

            {/* <SidebarGroupLabel>Master</SidebarGroupLabel> */}
            {/* <SidebarMenu>
                {masterItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url === item.href} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu> */}
            {masterItemsV.length > 0 && (
                <>
                    <SidebarGroupLabel>Master</SidebarGroupLabel>
                    <SidebarMenu>
                        {masterItemsV.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </>
            )}
            {userManagementItemsV.length > 0 && (
                <>
                    <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
                    <SidebarMenu>
                        {userManagementItemsV.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.href)}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </>
            )}
            {/* <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
            <SidebarMenu>
                {userManagementItems.map((item) => (
                    can('tes-permission') &&
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu> */}
        </SidebarGroup>
    );
}
