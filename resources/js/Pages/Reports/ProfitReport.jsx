import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function ProfitReport({
    auth,
    filters,
    reportRows,
    summary,
    branches,
    customers,
    products,
}) {
    const [values, setValues] = useState({
        from: filters?.from || '',
        to: filters?.to || '',
        branch_id: filters?.branch_id || '',
        customer_id: filters?.customer_id || '',
        product_id: filters?.product_id || '',
    });

    const handleFilter = (e) => {
        e.preventDefault();

        router.get(route('reports.profit'), values, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        router.get(route('reports.profit'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profit Report</h2>}
        >
            <Head title="Profit Report" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                                <p className="text-sm text-gray-500">
                                    Filter profit data and export the current result.
                                </p>
                            </div>

                            <a
                                href={route('reports.profit.export', values)}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Export Excel
                            </a>
                        </div>

                        <form onSubmit={handleFilter} className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">From</label>
                                <input
                                    type="date"
                                    value={values.from}
                                    onChange={(e) => setValues({ ...values, from: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">To</label>
                                <input
                                    type="date"
                                    value={values.to}
                                    onChange={(e) => setValues({ ...values, to: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Branch</label>
                                <select
                                    value={values.branch_id}
                                    onChange={(e) => setValues({ ...values, branch_id: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300"
                                >
                                    <option value="">All</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Customer</label>
                                <select
                                    value={values.customer_id}
                                    onChange={(e) => setValues({ ...values, customer_id: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300"
                                >
                                    <option value="">All</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
                                <select
                                    value={values.product_id}
                                    onChange={(e) => setValues({ ...values, product_id: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300"
                                >
                                    <option value="">All</option>
                                    {products.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-5 flex flex-wrap gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Sales Amount</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900">
                                {formatCurrency(summary.sales_amount)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Cost Amount</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900">
                                {formatCurrency(summary.cost_amount)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Profit</div>
                            <div className="mt-2 text-2xl font-bold text-emerald-600">
                                {formatCurrency(summary.profit_amount)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Qty Sold</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900">
                                {summary.total_qty}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-slate-900">Profit Details</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="text-left text-sm font-semibold text-gray-700">
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Invoice</th>
                                        <th className="px-4 py-3">Branch</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3 text-right">Qty</th>
                                        <th className="px-4 py-3 text-right">Sale</th>
                                        <th className="px-4 py-3 text-right">Cost</th>
                                        <th className="px-4 py-3 text-right">Profit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                                    {reportRows.data.length > 0 ? (
                                        reportRows.data.map((row, index) => (
                                            <tr key={`${row.sale_id}-${index}`}>
                                                <td className="px-4 py-3">{row.sale_date}</td>
                                                <td className="px-4 py-3">{row.invoice_no}</td>
                                                <td className="px-4 py-3">{row.branch_name}</td>
                                                <td className="px-4 py-3">{row.customer_name || '-'}</td>
                                                <td className="px-4 py-3">{row.product_name}</td>
                                                <td className="px-4 py-3 text-right">{row.quantity}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(row.line_total)}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(row.total_cost)}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-emerald-600">
                                                    {formatCurrency(row.profit)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="px-4 py-6 text-center text-sm text-gray-500">
                                                No profit data found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {reportRows.links && reportRows.links.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {reportRows.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`rounded-md px-3 py-2 text-sm ${
                                            link.active
                                                ? 'bg-slate-900 text-white'
                                                : 'border border-gray-300 text-gray-700'
                                        } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
