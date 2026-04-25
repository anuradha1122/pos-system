import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function StockMovements({ movements, branches, products, filters }) {
    const { auth } = usePage().props;

    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');
    const [branchId, setBranchId] = useState(filters.branch_id ?? '');
    const [productId, setProductId] = useState(filters.product_id ?? '');
    const [type, setType] = useState(filters.type ?? '');

    const exportParams = {
        date_from: dateFrom,
        date_to: dateTo,
        branch_id: branchId,
        product_id: productId,
        type,
    };

    const apply = () => {
        router.get(
            route('reports.stock-movements'),
            {
                date_from: dateFrom,
                date_to: dateTo,
                branch_id: branchId,
                product_id: productId,
                type,
            },
            { preserveState: true, replace: true }
        );
    };

    const reset = () => {
        setDateFrom('');
        setDateTo('');
        setBranchId('');
        setProductId('');
        setType('');

        router.get(route('reports.stock-movements'), {}, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Stock Movement Report</h2>}
        >
            <Head title="Stock Movement Report" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                                <p className="text-sm text-gray-500">
                                    Filter stock movements and export results
                                </p>
                            </div>

                            <a
                                href={route('reports.stock-movements.export', {
                                    date_from: dateFrom,
                                    date_to: dateTo,
                                    branch_id: branchId,
                                    product_id: productId,
                                    type: type,
                                })}
                                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Export Excel
                            </a>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />

                            <input
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            />

                            <select
                                value={branchId}
                                onChange={e => setBranchId(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>

                            <select
                                value={productId}
                                onChange={e => setProductId(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Products</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            <select
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Types</option>
                                <option value="purchase">Purchase</option>
                                <option value="sale">Sale</option>
                                <option value="adjustment_in">Adjustment In</option>
                                <option value="adjustment_out">Adjustment Out</option>
                            </select>

                            <div className="md:col-span-5 flex gap-3">
                                <button
                                    onClick={apply}
                                    className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                                >
                                    Filter
                                </button>

                                <button
                                    onClick={() => {
                                        setDateFrom('');
                                        setDateTo('');
                                        setBranchId('');
                                        setProductId('');
                                        setType('');

                                        router.get(route('reports.stock-movements'));
                                    }}
                                    className="rounded-lg border border-gray-300 px-4 py-2"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow overflow-x-auto">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Stock Movements</h3>
                            <p className="text-sm text-gray-500">
                                Full stock ledger showing every in and out transaction.
                            </p>
                        </div>

                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        In
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Out
                                    </th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                        Balance
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        Branch
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                        User
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                {movements.data.length > 0 ? (
                                    movements.data.map((movement) => (
                                        <tr key={movement.id}>
                                            <td className="px-4 py-3">{movement.date}</td>
                                            <td className="px-4 py-3">{movement.product}</td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                                                    {movement.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">{movement.qty_in}</td>
                                            <td className="px-4 py-3 text-right">{movement.qty_out}</td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {movement.balance_after}
                                            </td>
                                            <td className="px-4 py-3">{movement.branch}</td>
                                            <td className="px-4 py-3">{movement.user}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-4 py-6 text-center text-sm text-gray-500"
                                        >
                                            No stock movements found for selected filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {movements.links && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {movements.links.map((link, index) => (
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
