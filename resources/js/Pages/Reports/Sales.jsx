import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Sales({ sales, customers, branches, summary, filters }) {
    const { auth } = usePage().props;

    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [customerId, setCustomerId] = useState(filters.customer_id ?? '');
    const [branchId, setBranchId] = useState(filters.branch_id ?? '');

    const applyFilters = () => {
        router.get(
            route('reports.sales'),
            {
                date_from: dateFrom,
                date_to: dateTo,
                customer_id: customerId,
                branch_id: branchId,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setDateFrom('');
        setDateTo('');
        setCustomerId('');
        setBranchId('');

        router.get(route('reports.sales'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Sales Report</h2>}
        >
            <Head title="Sales Report" />

            <div className="py-6 print:py-0">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 print:max-w-full print:px-0">
                    <div className="flex items-center justify-between print:hidden">
                        <div className="text-sm text-gray-500">
                            Filter sales by date, customer, and branch
                        </div>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Print Report
                        </button>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:hidden">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date From
                                </label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Date To
                                </label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Customer
                                </label>
                                <select
                                    value={customerId}
                                    onChange={(e) => setCustomerId(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">All Customers</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Branch
                                </label>
                                <select
                                    value={branchId}
                                    onChange={(e) => setBranchId(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">All Branches</option>
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end gap-2">
                                <button
                                    type="button"
                                    onClick={applyFilters}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                                >
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="text-sm text-gray-500">Total Invoices</div>
                            <div className="mt-2 text-3xl font-bold text-slate-900">
                                {summary.total_invoices}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="text-sm text-gray-500">Total Sales Amount</div>
                            <div className="mt-2 text-3xl font-bold text-slate-900">
                                {Number(summary.total_amount).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:rounded-none print:shadow-none">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Sales Report</h3>
                                <p className="text-sm text-gray-500">
                                    Generated sales list based on selected filters
                                </p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Invoice No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Branch
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Cashier
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 print:hidden">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {sales.data.length > 0 ? (
                                        sales.data.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="px-4 py-3">{sale.invoice_no}</td>
                                                <td className="px-4 py-3">{sale.sale_date}</td>
                                                <td className="px-4 py-3">
                                                    {sale.customer?.name ?? 'Walk-in Customer'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {sale.branch?.name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {sale.creator?.name ?? '-'}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">
                                                    {Number(sale.grand_total).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right print:hidden">
                                                    <Link
                                                        href={route('sales.show', sale.id)}
                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                No sales found for selected filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {sales.links && (
                            <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                                {sales.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-white text-gray-700'
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
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
