import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function LowStock({ stocks, branches, filters }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [branchId, setBranchId] = useState(filters.branch_id ?? '');
    const [onlyLow, setOnlyLow] = useState(
        filters.only_low === true ||
        filters.only_low === 1 ||
        filters.only_low === '1'
    );

    const exportParams = {
        search,
        branch_id: branchId,
        only_low: onlyLow ? 1 : 0,
    };

    const apply = () => {
        router.get(
            route('reports.low-stock'),
            {
                search,
                branch_id: branchId,
                only_low: onlyLow ? 1 : 0,
            },
            { preserveState: true, replace: true }
        );
    };

    const reset = () => {
        setSearch('');
        setBranchId('');
        setOnlyLow(false);

        router.get(route('reports.low-stock'), {}, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Low Stock Report</h2>}
        >
            <Head title="Low Stock Report" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                                <p className="text-sm text-gray-500">
                                    Filter low stock items and export current results.
                                </p>
                            </div>

                            <a
                                href={route('reports.low-stock.export', exportParams)}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Export Excel
                            </a>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search product or SKU"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
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

                            <div className="flex items-end">
                                <label className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2">
                                    <input
                                        type="checkbox"
                                        checked={onlyLow}
                                        onChange={(e) => setOnlyLow(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-700">Only Low Stock</span>
                                </label>
                            </div>

                            <div className="flex items-end gap-3">
                                <button
                                    type="button"
                                    onClick={apply}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Filter
                                </button>

                                <button
                                    type="button"
                                    onClick={reset}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow overflow-x-auto">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Low Stock Items</h3>
                            <p className="text-sm text-gray-500">
                                Products that are below or near the reorder threshold.
                            </p>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        SKU
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Branch
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Qty
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Reorder
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Shortage
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                {stocks.data.length > 0 ? (
                                    stocks.data.map((stock) => (
                                        <tr key={stock.id}>
                                            <td className="px-4 py-3">{stock.product}</td>
                                            <td className="px-4 py-3">{stock.sku}</td>
                                            <td className="px-4 py-3">{stock.branch}</td>
                                            <td className="px-4 py-3 text-right">{stock.quantity}</td>
                                            <td className="px-4 py-3 text-right">{stock.reorder_level}</td>
                                            <td className="px-4 py-3">
                                                {stock.is_low ? (
                                                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
                                                        Low
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                                        OK
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {stock.shortage > 0 ? stock.shortage : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="px-4 py-6 text-center text-sm text-gray-500"
                                        >
                                            No stock records found for selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {stocks.links && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {stocks.links.map((link, index) => (
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
