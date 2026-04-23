import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, stocks, filters, branches }) {
    const updateFilters = (key, value) => {
        router.get(
            route('stock-balances.index'),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Stock Balances</h2>}
        >
            <Head title="Stock Balances" />

            <div className="space-y-6 p-6">
                <div className="rounded-xl bg-white p-4 shadow">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                value={filters.search || ''}
                                onChange={(e) => updateFilters('search', e.target.value)}
                                placeholder="Product name or SKU"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Branch</label>
                            <select
                                value={filters.branch_id || ''}
                                onChange={(e) => updateFilters('branch_id', e.target.value)}
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

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Low Stock</label>
                            <select
                                value={filters.low_stock || ''}
                                onChange={(e) => updateFilters('low_stock', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All</option>
                                <option value="1">Low Stock Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Quantity</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Reorder Level</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {stocks.data.length > 0 ? (
                                stocks.data.map((stock) => (
                                    <tr key={stock.id}>
                                        <td className="px-4 py-3 text-sm text-gray-800">{stock.branch?.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{stock.product?.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{stock.product?.sku}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {stock.product?.category?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {stock.product?.unit?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{stock.quantity}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">
                                            {stock.product?.reorder_level}
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            {stock.is_low_stock ? (
                                                <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                                                    OK
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No stock balances found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {stocks.links.map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active ? 'bg-slate-900 text-white' : 'bg-white text-gray-700'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
