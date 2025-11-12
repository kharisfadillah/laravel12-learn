// import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { /* BookOpen, Folder,*/ Building, FileKey, LandPlot, PersonStanding, User, UserCog } from 'lucide-react';
import AppLogo from './app-logo';

const masterItems: NavItem[] = [
    {
        title: 'Unit Usaha',
        href: '/company',
        icon: Building,
    },
    {
        title: 'Departemen',
        href: '/department',
        icon: Building,
    },
    {
        title: 'Provinsi',
        href: '/province',
        icon: LandPlot,
    },
    {
        title: 'Kabupaten',
        href: '/regency',
        icon: LandPlot,
    },
    {
        title: 'Kandidat',
        href: '/participant',
        icon: PersonStanding,
    },
];

const userManagementItems: NavItem[] = [
    {
        title: 'Role',
        href: '/role',
        icon: UserCog,
    },
    {
        title: 'Hak Akses',
        href: '/permission',
        icon: FileKey,
    },
    {
        title: 'Pengguna',
        href: '/user',
        icon: User,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain masterItems={masterItems} userManagementItems={userManagementItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
