import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ purchases, suppliers, filters }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [date, setDate] = useState(filters.date ?? '');
    const [supplierId, setSupplierId] = useState(filters.supplier_id ?? '');

    const applyFilters = () => {
        router.get(
            route('purchases.index'),
            {
                search,
                date,
                supplier_id: supplierId,
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
        setSupplierId('');

        router.get(route('purchases.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Purchases</h2>}
        >
            <Head title="Purchases" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">

                        {/* FILTERS */}
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-4">

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Purchase no or invoice no"
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
                                        Supplier
                                    </label>
                                    <select
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">All Suppliers</option>
                                        {suppliers.map((supplier) => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.name}
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
                                href={route('purchases.create')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                            >
                                New Purchase
                            </Link>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">

                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Purchase No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Supplier Invoice
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Supplier
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Branch
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Created By
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Paid
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Balance
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {purchases.data.length > 0 ? (
                                        purchases.data.map((purchase) => (
                                            <tr key={purchase.id}>

                                                <td className="px-4 py-3">
                                                    {purchase.purchase_no ?? purchase.id}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {purchase.invoice_no ?? '-'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {purchase.purchase_date}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {purchase.supplier?.name ?? '-'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {purchase.branch?.name ?? '-'}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {purchase.creator?.name ?? '-'}
                                                </td>

                                                <td className="px-4 py-3 font-medium">
                                                    {Number(purchase.total_amount).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {Number(purchase.paid_amount ?? 0).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    {Number(purchase.balance_amount ?? 0).toFixed(2)}
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                                            purchase.payment_status === 'paid'
                                                                ? 'bg-green-100 text-green-700'
                                                                : purchase.payment_status === 'partial'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {purchase.payment_status ?? 'credit'}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={route('purchases.show', purchase.id)}
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
                                                colSpan="11"
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                No purchases found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        {purchases.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {purchases.links.map((link, index) => (
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
