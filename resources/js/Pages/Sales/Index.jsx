import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ sales, customers, filters }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [date, setDate] = useState(filters.date ?? '');
    const [customerId, setCustomerId] = useState(filters.customer_id ?? '');

    const applyFilters = () => {
        router.get(
            route('sales.index'),
            {
                search,
                date,
                customer_id: customerId,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const resetFilters = () => {
        setSearch('');
        setDate('');
        setCustomerId('');

        router.get(route('sales.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Sales</h2>}
        >
            <Head title="Sales" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Search Invoice
                                    </label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Invoice number"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
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

                            <Link
                                href={route('sales.create')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                            >
                                New Sale
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Invoice
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
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
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
                                                <td className="px-4 py-3 font-medium">
                                                    {Number(sale.grand_total).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
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
                                                No sales found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {sales.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
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
