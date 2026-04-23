import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ customers, products }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        sale_date: new Date().toISOString().slice(0, 10),
        discount: 0,
        tax: 0,
        notes: '',
        items: [],
    });

    const [selectedProductId, setSelectedProductId] = useState('');

    const selectedProduct = useMemo(
        () => products.find((product) => String(product.product_id) === String(selectedProductId)),
        [products, selectedProductId]
    );

    const addItem = () => {
        if (!selectedProduct) return;

        const exists = data.items.find(
            (item) => String(item.product_id) === String(selectedProduct.product_id)
        );

        if (exists) return;

        setData('items', [
            ...data.items,
            {
                product_id: selectedProduct.product_id,
                product_name: selectedProduct.name,
                sku: selectedProduct.sku,
                available_qty: selectedProduct.available_qty,
                quantity: 1,
                unit_price: selectedProduct.selling_price ?? 0,
            },
        ]);

        setSelectedProductId('');
    };

    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index][field] = value;
        setData('items', updated);
    };

    const removeItem = (index) => {
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const subtotal = data.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.unit_price || 0);
    }, 0);

    const grandTotal = subtotal - Number(data.discount || 0) + Number(data.tax || 0);

    const submit = (e) => {
        e.preventDefault();

        post(route('sales.store'), {
            data: {
                ...data,
                items: data.items.map((item) => ({
                    product_id: item.product_id,
                    quantity: Number(item.quantity),
                    unit_price: Number(item.unit_price),
                })),
                discount: Number(data.discount || 0),
                tax: Number(data.tax || 0),
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Create Sale</h2>}
        >
            <Head title="Create Sale" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Customer</label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) => setData('customer_id', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">Walk-in Customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name} - {customer.phone}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <div className="mt-1 text-sm text-red-600">{errors.customer_id}</div>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Sale Date</label>
                                    <input
                                        type="date"
                                        value={data.sale_date}
                                        onChange={(e) => setData('sale_date', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    {errors.sale_date && <div className="mt-1 text-sm text-red-600">{errors.sale_date}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="md:col-span-3">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Product</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_id}>
                                                {product.name} ({product.sku}) - Stock: {product.available_qty}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Available</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Qty</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data.items.length > 0 ? (
                                            data.items.map((item, index) => (
                                                <tr key={item.product_id}>
                                                    <td className="px-4 py-3">
                                                        {item.product_name} <br />
                                                        <span className="text-xs text-gray-500">{item.sku}</span>
                                                    </td>
                                                    <td className="px-4 py-3">{item.available_qty}</td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={item.quantity}
                                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                            className="w-24 rounded-lg border border-gray-300 px-3 py-2"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                            className="w-28 rounded-lg border border-gray-300 px-3 py-2"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {(Number(item.quantity || 0) * Number(item.unit_price || 0)).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            className="text-sm text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-6 text-center text-sm text-gray-500">
                                                    No items added yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {errors.items && <div className="mt-3 text-sm text-red-600">{errors.items}</div>}
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Discount</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.discount}
                                        onChange={(e) => setData('discount', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Tax</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.tax}
                                        onChange={(e) => setData('tax', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Grand Total</label>
                                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-semibold">
                                        {grandTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Notes</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-slate-900 px-5 py-2 text-white disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Complete Sale'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
