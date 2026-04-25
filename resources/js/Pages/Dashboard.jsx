import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function Dashboard({
    auth,
    stats,
    salesByDay = [],
    topSellingProducts = [],
    recentSales = [],
}) {
    const cards = [
        { label: 'Branches', value: stats?.branches ?? 0 },
        { label: 'Users', value: stats?.users ?? 0 },
        { label: 'Roles', value: stats?.roles ?? 0 },
        { label: 'Products', value: stats?.products ?? 0 },
        { label: 'Customers', value: stats?.customers ?? 0 },
        { label: 'Purchases', value: stats?.purchases ?? 0 },
        { label: 'Today Sales', value: formatCurrency(stats?.today_sales_amount ?? 0) },
        { label: 'Today Sales Count', value: stats?.today_sales_count ?? 0 },
        { label: 'Month Sales', value: formatCurrency(stats?.month_sales_amount ?? 0) },
        { label: 'Low Stock Items', value: stats?.low_stock_count ?? 0 },
    ];

    const maxSalesAmount = Math.max(...salesByDay.map(item => Number(item.amount || 0)), 1);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
                        {cards.map((card) => (
                            <div key={card.label} className="rounded-xl bg-white p-5 shadow">
                                <div className="text-sm text-gray-500">{card.label}</div>
                                <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <div className="rounded-xl bg-white p-6 shadow xl:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-slate-900">Sales - Last 7 Days</h3>
                            </div>

                            <div className="flex h-72 items-end gap-3">
                                {salesByDay.map((item) => {
                                    const height = `${Math.max((Number(item.amount || 0) / maxSalesAmount) * 100, 4)}%`;

                                    return (
                                        <div key={item.date} className="flex flex-1 flex-col items-center">
                                            <div className="mb-2 text-xs text-gray-500">
                                                {formatCurrency(item.amount)}
                                            </div>
                                            <div className="flex h-56 w-full items-end">
                                                <div
                                                    className="w-full rounded-t-lg bg-slate-900"
                                                    style={{ height }}
                                                />
                                            </div>
                                            <div className="mt-2 text-xs text-gray-600">{item.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-slate-900">Top Selling Products</h3>

                            <div className="space-y-4">
                                {topSellingProducts.length > 0 ? (
                                    topSellingProducts.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start justify-between border-b border-gray-100 pb-3 last:border-b-0"
                                        >
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">
                                                    {index + 1}. {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Qty Sold: {item.total_qty}
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-slate-700">
                                                {formatCurrency(item.total_amount)}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-gray-500">No sales yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Sales</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3">Invoice</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Branch</th>
                                        <th className="px-4 py-3">Cashier</th>
                                        <th className="px-4 py-3 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {recentSales.length > 0 ? (
                                        recentSales.map((sale) => (
                                            <tr key={sale.id} className="text-sm text-gray-700">
                                                <td className="px-4 py-3">{sale.invoice_no}</td>
                                                <td className="px-4 py-3">{sale.sale_date}</td>
                                                <td className="px-4 py-3">{sale.customer ?? '-'}</td>
                                                <td className="px-4 py-3">{sale.branch ?? '-'}</td>
                                                <td className="px-4 py-3">{sale.cashier ?? '-'}</td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {formatCurrency(sale.total_amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                                                No recent sales found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
