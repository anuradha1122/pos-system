import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { auth } = usePage().props;

    const can = (permission) => {
        return auth?.permissions?.includes(permission);
    };

    const canAny = (permissions = []) => {
        return permissions.some((permission) => can(permission));
    };

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

                {can('dashboard.view') && (
                    <>
                        <div className={sectionTitleClass}>Main</div>

                        <Link
                            href={route('dashboard')}
                            className={linkClass(route().current('dashboard'))}
                        >
                            Dashboard
                        </Link>
                    </>
                )}

                {canAny(['user.view', 'role.view', 'branch.view']) && (
                    <>
                        <div className={sectionTitleClass}>User Management</div>

                        {can('user.view') && (
                            <Link
                                href={route('users.index')}
                                className={linkClass(route().current('users.*'))}
                            >
                                Users
                            </Link>
                        )}

                        {can('role.view') && (
                            <Link
                                href={route('roles.index')}
                                className={linkClass(route().current('roles.*'))}
                            >
                                Roles
                            </Link>
                        )}

                        {can('branch.view') && (
                            <Link
                                href={route('branches.index')}
                                className={linkClass(route().current('branches.*'))}
                            >
                                Branches
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'category.view',
                    'brand.view',
                    'unit.view',
                    'product.view',
                    'customer.view',
                    'supplier.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Master Data</div>

                        {can('category.view') && (
                            <Link
                                href={route('categories.index')}
                                className={linkClass(route().current('categories.*'))}
                            >
                                Categories
                            </Link>
                        )}

                        {can('brand.view') && (
                            <Link
                                href={route('brands.index')}
                                className={linkClass(route().current('brands.*'))}
                            >
                                Brands
                            </Link>
                        )}

                        {can('unit.view') && (
                            <Link
                                href={route('units.index')}
                                className={linkClass(route().current('units.*'))}
                            >
                                Units
                            </Link>
                        )}

                        {can('product.view') && (
                            <Link
                                href={route('products.index')}
                                className={linkClass(route().current('products.*'))}
                            >
                                Products
                            </Link>
                        )}

                        {can('customer.view') && (
                            <Link
                                href={route('customers.index')}
                                className={linkClass(route().current('customers.*'))}
                            >
                                Customers
                            </Link>
                        )}

                        {can('supplier.view') && (
                            <Link
                                href={route('suppliers.index')}
                                className={linkClass(route().current('suppliers.*'))}
                            >
                                Suppliers
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'stock-balance.view',
                    'stock-movement.view',
                    'stock-adjustment.view',
                    'purchase.view',
                    'purchase-return.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Inventory</div>

                        {can('stock-balance.view') && (
                            <Link
                                href={route('stock-balances.index')}
                                className={linkClass(route().current('stock-balances.*'))}
                            >
                                Stock Balances
                            </Link>
                        )}

                        {/* {can('stock-movement.view') && (
                            <Link
                                href={route('stock-movements.index')}
                                className={linkClass(route().current('stock-movements.*'))}
                            >
                                Stock Movements
                            </Link>
                        )} */}

                        {can('stock-adjustment.view') && (
                            <Link
                                href={route('stock-adjustments.index')}
                                className={linkClass(route().current('stock-adjustments.*'))}
                            >
                                Stock Adjustments
                            </Link>
                        )}

                        {can('purchase.view') && (
                            <Link
                                href={route('purchases.index')}
                                className={linkClass(route().current('purchases.*'))}
                            >
                                Purchases
                            </Link>
                        )}

                        {can('purchase-return.view') && (
                            <Link
                                href={route('purchase-returns.index')}
                                className={linkClass(route().current('purchase-returns.*'))}
                            >
                                Purchase Returns
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'sale.view',
                    'sale-return.view',
                    'customer-credit.view',
                    'supplier-credit.view',
                    'payment.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Sales & Finance</div>

                        {can('sale.view') && (
                            <Link
                                href={route('sales.index')}
                                className={linkClass(route().current('sales.*'))}
                            >
                                Sales
                            </Link>
                        )}

                        {can('sale-return.view') && (
                            <Link
                                href={route('sale-returns.index')}
                                className={linkClass(route().current('sale-returns.*'))}
                            >
                                Sales Returns
                            </Link>
                        )}

                        {can('customer-credit.view') && (
                            <Link
                                href={route('customer-credits.index')}
                                className={linkClass(route().current('customer-credits.*'))}
                            >
                                Customer Credits
                            </Link>
                        )}

                        {can('supplier-credit.view') && (
                            <Link
                                href={route('supplier-credits.index')}
                                className={linkClass(route().current('supplier-credits.*'))}
                            >
                                Supplier Credits
                            </Link>
                        )}

                        {can('payment.view') && (
                            <Link
                                href={route('payments.index')}
                                className={linkClass(route().current('payments.*'))}
                            >
                                Payments
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'expense.view',
                    'daily-closing.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Operations</div>

                        {can('expense.view') && (
                            <Link
                                href={route('expenses.index')}
                                className={linkClass(route().current('expenses.*'))}
                            >
                                Expenses
                            </Link>
                        )}

                        {can('daily-closing.view') && (
                            <Link
                                href={route('daily-closings.index')}
                                className={linkClass(route().current('daily-closings.*'))}
                            >
                                Daily Closings
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'report.sales.view',
                    'report.profit.view',
                    'report.profit-by-product.view',
                    'report.cash-flow.view',
                    'report.inventory-valuation.view',
                    'report.stock-movement.view',
                    'report.low-stock.view',
                    'report.expense.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Reports</div>

                        {can('report.sales.view') && (
                            <Link
                                href={route('reports.sales')}
                                className={linkClass(route().current('reports.sales'))}
                            >
                                Sales Report
                            </Link>
                        )}

                        {can('report.profit.view') && (
                            <Link
                                href={route('reports.profit')}
                                className={linkClass(route().current('reports.profit'))}
                            >
                                Profit Report
                            </Link>
                        )}

                        {can('report.profit-by-product.view') && (
                            <Link
                                href={route('reports.profit-by-product.index')}
                                className={linkClass(route().current('reports.profit-by-product.*'))}
                            >
                                Profit by Product
                            </Link>
                        )}

                        {can('report.cash-flow.view') && (
                            <Link
                                href={route('reports.cash-flow.index')}
                                className={linkClass(route().current('reports.cash-flow.*'))}
                            >
                                Cash Flow Report
                            </Link>
                        )}

                        {can('report.inventory-valuation.view') && (
                            <Link
                                href={route('reports.inventory-valuation.index')}
                                className={linkClass(route().current('reports.inventory-valuation.*'))}
                            >
                                Inventory Valuation
                            </Link>
                        )}

                        {can('report.stock-movement.view') && (
                            <Link
                                href={route('reports.stock-movements')}
                                className={linkClass(route().current('reports.stock-movements'))}
                            >
                                Stock Movement Report
                            </Link>
                        )}

                        {can('report.low-stock.view') && (
                            <Link
                                href={route('reports.low-stock')}
                                className={linkClass(route().current('reports.low-stock'))}
                            >
                                Low Stock Report
                            </Link>
                        )}

                        {can('report.expense.view') && (
                            <Link
                                href={route('reports.expenses')}
                                className={linkClass(route().current('reports.expenses'))}
                            >
                                Expense Report
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'statement.customer.view',
                    'statement.supplier.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>Statements</div>

                        {can('statement.customer.view') && (
                            <Link
                                href={route('customer-statements.index')}
                                className={linkClass(route().current('customer-statements.*'))}
                            >
                                Customer Statements
                            </Link>
                        )}

                        {can('statement.supplier.view') && (
                            <Link
                                href={route('supplier-statements.index')}
                                className={linkClass(route().current('supplier-statements.*'))}
                            >
                                Supplier Statements
                            </Link>
                        )}
                    </>
                )}

                {canAny([
                    'company-settings.view',
                    'audit-log.view',
                ]) && (
                    <>
                        <div className={sectionTitleClass}>System</div>

                        {can('company-settings.view') && (
                            <Link
                                href={route('company-settings.edit')}
                                className={linkClass(route().current('company-settings.*'))}
                            >
                                Company Settings
                            </Link>
                        )}

                        {can('audit-log.view') && (
                            <Link
                                href={route('audit-logs.index')}
                                className={linkClass(route().current('audit-logs.*'))}
                            >
                                Audit Logs
                            </Link>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
}
