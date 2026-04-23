import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Create({ auth, branches, products }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        branch_id: '',
        product_id: '',
        type: 'opening_stock',
        quantity: '',
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('stock-adjustments.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Stock Adjustment</h2>}
        >
            <Head title="Stock Adjustment" />

            <div className="p-6 space-y-4">
                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                        {flash.error}
                    </div>
                )}

                <div className="rounded-xl bg-white p-6 shadow">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Branch</label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">Select branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                            {errors.branch_id && <div className="mt-1 text-sm text-red-600">{errors.branch_id}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
                            <select
                                value={data.product_id}
                                onChange={(e) => setData('product_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">Select product</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} ({product.sku})
                                    </option>
                                ))}
                            </select>
                            {errors.product_id && <div className="mt-1 text-sm text-red-600">{errors.product_id}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="opening_stock">Opening Stock</option>
                                <option value="adjustment_in">Adjustment In</option>
                                <option value="adjustment_out">Adjustment Out</option>
                            </select>
                            {errors.type && <div className="mt-1 text-sm text-red-600">{errors.type}</div>}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.quantity && <div className="mt-1 text-sm text-red-600">{errors.quantity}</div>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                                rows="4"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.note && <div className="mt-1 text-sm text-red-600">{errors.note}</div>}
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                Save Adjustment
                            </button>

                            <Link
                                href={route('stock-adjustments.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
