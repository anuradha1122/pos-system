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

    const apply = () => {
        router.get(route('reports.stock-movements'), {
            date_from: dateFrom,
            date_to: dateTo,
            branch_id: branchId,
            product_id: productId,
            type,
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Stock Movement Report" />

            <div className="p-6 space-y-6">
                {/* Filters */}
                <div className="bg-white p-4 rounded shadow grid md:grid-cols-5 gap-4">
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />

                    <select value={branchId} onChange={e => setBranchId(e.target.value)}>
                        <option value="">All Branches</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>

                    <select value={productId} onChange={e => setProductId(e.target.value)}>
                        <option value="">All Products</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>

                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="purchase">Purchase</option>
                        <option value="sale">Sale</option>
                        <option value="adjustment_in">Adjustment In</option>
                        <option value="adjustment_out">Adjustment Out</option>
                    </select>

                    <button onClick={apply} className="bg-black text-white px-4 py-2">
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white p-4 rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product</th>
                                <th>Type</th>
                                <th>In</th>
                                <th>Out</th>
                                <th>Balance</th>
                                <th>Branch</th>
                                <th>User</th>
                            </tr>
                        </thead>

                        <tbody>
                            {movements.data.map(m => (
                                <tr key={m.id}>
                                    <td>{m.date}</td>
                                    <td>{m.product}</td>
                                    <td>{m.type}</td>
                                    <td>{m.qty_in}</td>
                                    <td>{m.qty_out}</td>
                                    <td>{m.balance_after}</td>
                                    <td>{m.branch}</td>
                                    <td>{m.user}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
