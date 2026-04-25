import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

export default function Create({ auth, purchases }) {
    const [selectedPurchaseId, setSelectedPurchaseId] = useState('');

    const selectedPurchase = useMemo(() => {
        return purchases.find((purchase) => purchase.id == selectedPurchaseId);
    }, [selectedPurchaseId, purchases]);

    const { data, setData, post, processing, errors } = useForm({
        purchase_header_id: '',
        return_date: new Date().toISOString().slice(0, 10),
        reason: '',
        items: [],
    });

    const selectPurchase = (id) => {
        setSelectedPurchaseId(id);

        const purchase = purchases.find((item) => item.id == id);

        setData({
            ...data,
            purchase_header_id: id,
            items:
                purchase?.items?.map((item) => ({
                    purchase_item_id: item.id,
                    product_id: item.product_id,
                    product_name: item.product?.name,
                    purchased_quantity: item.quantity,
                    quantity: '',
                    cost_price: item.cost_price,
                })) ?? [],
        });
    };

    const updateItemQty = (index, quantity) => {
        const updatedItems = [...data.items];
        updatedItems[index].quantity = quantity;
        setData('items', updatedItems);
    };

    const submit = (e) => {
        e.preventDefault();

        const filteredItems = data.items.filter((item) => Number(item.quantity) > 0);

        post(route('purchase-returns.store'), {
            data: {
                ...data,
                items: filteredItems,
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Purchase Return" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Create Purchase Return</h1>

                <form onSubmit={submit} className="space-y-6 rounded bg-white p-6 shadow">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Purchase</label>
                        <select
                            value={selectedPurchaseId}
                            onChange={(e) => selectPurchase(e.target.value)}
                            className="w-full rounded border-gray-300"
                        >
                            <option value="">Select Purchase</option>
                            {purchases.map((purchase) => (
                                <option key={purchase.id} value={purchase.id}>
                                    Purchase #{purchase.id} - {purchase.supplier?.name} -{' '}
                                    {purchase.purchase_date}
                                </option>
                            ))}
                        </select>

                        {errors.purchase_header_id && (
                            <div className="mt-1 text-sm text-red-600">
                                {errors.purchase_header_id}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Return Date</label>
                        <input
                            type="date"
                            value={data.return_date}
                            onChange={(e) => setData('return_date', e.target.value)}
                            className="w-full rounded border-gray-300"
                        />
                        {errors.return_date && (
                            <div className="mt-1 text-sm text-red-600">{errors.return_date}</div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Reason</label>
                        <input
                            type="text"
                            value={data.reason}
                            onChange={(e) => setData('reason', e.target.value)}
                            className="w-full rounded border-gray-300"
                            placeholder="Damaged items, wrong supply, etc."
                        />
                    </div>

                    {selectedPurchase && (
                        <div>
                            <h2 className="mb-3 text-lg font-semibold">Return Items</h2>

                            <table className="w-full text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-3 text-left">Product</th>
                                        <th className="p-3 text-right">Purchased Qty</th>
                                        <th className="p-3 text-right">Cost Price</th>
                                        <th className="p-3 text-right">Return Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((item, index) => (
                                        <tr key={item.purchase_item_id} className="border-t">
                                            <td className="p-3">{item.product_name}</td>
                                            <td className="p-3 text-right">
                                                {item.purchased_quantity}
                                            </td>
                                            <td className="p-3 text-right">
                                                Rs. {Number(item.cost_price).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-right">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItemQty(index, e.target.value)
                                                    }
                                                    className="w-28 rounded border-gray-300 text-right"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {errors.items && (
                                <div className="mt-2 text-sm text-red-600">{errors.items}</div>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                    >
                        Save Purchase Return
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
