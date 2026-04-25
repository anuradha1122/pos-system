import { Link } from '@inertiajs/react';

export default function Sidebar() {
    const linkClass = (active) =>
        `block rounded px-3 py-2 text-sm ${
            active ? 'bg-slate-900 text-white' : 'text-gray-700 hover:bg-gray-100'
        }`;

    const sectionTitleClass =
        'px-3 pt-4 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500';

    return (
        <aside className="w-72 border-r border-gray-200 bg-white p-6">
            <h1 className="text-xl font-bold text-slate-900">POS System</h1>

            <div className="mt-6 space-y-1">
                <div className={sectionTitleClass}>Main</div>

                <Link href={route('dashboard')} className={linkClass(route().current('dashboard'))}>
                    Dashboard
                </Link>

                <div className={sectionTitleClass}>User Management</div>

                <Link href={route('users.index')} className={linkClass(route().current('users.*'))}>
                    Users
                </Link>

                <Link href={route('roles.index')} className={linkClass(route().current('roles.*'))}>
                    Roles
                </Link>

                <Link href={route('branches.index')} className={linkClass(route().current('branches.*'))}>
                    Branches
                </Link>

                <div className={sectionTitleClass}>Master Data</div>

                <Link href={route('categories.index')} className={linkClass(route().current('categories.*'))}>
                    Categories
                </Link>

                <Link href={route('brands.index')} className={linkClass(route().current('brands.*'))}>
                    Brands
                </Link>

                <Link href={route('units.index')} className={linkClass(route().current('units.*'))}>
                    Units
                </Link>

                <Link href={route('products.index')} className={linkClass(route().current('products.*'))}>
                    Products
                </Link>

                <Link href={route('suppliers.index')} className={linkClass(route().current('suppliers.*'))}>
                    Suppliers
                </Link>

                <Link
                    href={route('supplier-credits.index')}
                    className={linkClass(route().current('supplier-credits.*'))}
                >
                    Supplier Credits
                </Link>

                <div className={sectionTitleClass}>Inventory</div>

                <Link
                    href={route('stock-adjustments.index')}
                    className={linkClass(route().current('stock-adjustments.*'))}
                >
                    Stock Adjustments
                </Link>

                <Link
                    href={route('stock-balances.index')}
                    className={linkClass(route().current('stock-balances.*'))}
                >
                    Stock Balances
                </Link>

                <Link href={route('purchases.index')} className={linkClass(route().current('purchases.*'))}>
                    Purchases
                </Link>

                <Link
                    href={route('purchase-returns.index')}
                    className={linkClass(route().current('purchase-returns.*'))}
                >
                    Purchase Returns
                </Link>

                <Link
                    href={route('payments.index')}
                    className={linkClass(route().current('payments.*'))}
                >
                    Payments
                </Link>

                <div className={sectionTitleClass}>Sales</div>

                <Link href={route('customers.index')} className={linkClass(route().current('customers.*'))}>
                    Customers
                </Link>

                <Link
                    href={route('customer-credits.index')}
                    className={linkClass(route().current('customer-credits.*'))}
                >
                    Customer Credits
                </Link>

                <Link href={route('sales.index')} className={linkClass(route().current('sales.*'))}>
                    Sales
                </Link>

                <Link
                    href={route('sale-returns.index')}
                    className={linkClass(route().current('sale-returns.*'))}
                >
                    Sales Returns
                </Link>

                <div className={sectionTitleClass}>Reports</div>

                <Link href={route('reports.sales')} className={linkClass(route().current('reports.sales'))}>
                    Sales Report
                </Link>

                <Link href={route('reports.stock-movements')} className={linkClass(route().current('reports.stock-movements'))}>
                    Stock Movements
                </Link>
                <Link href={route('reports.low-stock')} className={linkClass(route().current('reports.low-stock'))}>
                    Low Stock
                </Link>
                <Link href={route('reports.profit')} className={linkClass(route().current('reports.profit'))}>
                    Profit Report
                </Link>
            </div>
        </aside>
    );
}
