import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function LowStock({ stocks, branches, filters }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [branchId, setBranchId] = useState(filters.branch_id ?? '');
    const [onlyLow, setOnlyLow] = useState(filters.only_low ?? false);

    const apply = () => {
        router.get(route('reports.low-stock'), {
            search,
            branch_id: branchId,
            only_low: onlyLow ? 1 : 0,
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Low Stock Report" />

            <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search product or SKU"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select value={branchId} onChange={e => setBranchId(e.target.value)}>
                        <option value="">All Branches</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>

                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={onlyLow}
                            onChange={e => setOnlyLow(e.target.checked)}
                        />
                        Only Low Stock
                    </label>

                    <button onClick={apply} className="bg-black text-white px-4 py-2">
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white p-4 rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Branch</th>
                                <th>Qty</th>
                                <th>Reorder</th>
                                <th>Status</th>
                                <th>Shortage</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stocks.data.map(s => (
                                <tr key={s.id}>
                                    <td>{s.product}</td>
                                    <td>{s.sku}</td>
                                    <td>{s.branch}</td>
                                    <td>{s.quantity}</td>
                                    <td>{s.reorder_level}</td>
                                    <td>
                                        {s.is_low ? (
                                            <span className="text-red-600 font-semibold">
                                                Low
                                            </span>
                                        ) : (
                                            <span className="text-green-600">
                                                OK
                                            </span>
                                        )}
                                    </td>
                                    <td>{s.shortage > 0 ? s.shortage : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
