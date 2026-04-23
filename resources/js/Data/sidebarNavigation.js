import {
    LayoutDashboard,
    UserCog,
    ShieldCheck,
    Building2,
} from 'lucide-react';

const sidebarNavigation = [
    {
        label: 'Main',
        items: [
            { name: 'Dashboard', href: route('dashboard') },
        ],
    },
    {
        label: 'User Management',
        items: [
            { name: 'Users', href: route('users.index') },
            { name: 'Roles', href: route('roles.index') },
            { name: 'Branches', href: route('branches.index') },
        ],
    },
    {
        label: 'Master Data',
        items: [
            { name: 'Categories', href: route('categories.index') },
            { name: 'Brands', href: route('brands.index') },
            { name: 'Units', href: route('units.index') },
        ],
    },

];

export default sidebarNavigation;
