import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function Create({ sales, selectedSale, filters }) {
    const { auth } = usePage().props;
    const [selectedSaleId, setSelectedSaleId] = useState(filters.sale_header_id || '');

    const { data, setData, post, processing, errors } = useForm({
        sale_header_id: filters.sale_header_id || '',
        return_date: new Date().toISOString().slice(0, 10),
        reason: '',
        items: [],
    });

    useEffect(() => {
        if (selectedSale) {
            setData('items', selectedSale.items.map((item) => ({
                sale_item_id: item.id,
                quantity: '',
                available_qty: item.available_qty,
                product_name: item.product_name,
                sku: item.sku,
                unit_price: item.unit_price,
            })));
        }
    }, [selectedSale]);

    const loadSale = () => {
        if (!selectedSaleId) return;

        router.get(route('sale-returns.create'), {
            sale_header_id: selectedSaleId,
        }, {
            preserveState: false,
            replace: true,
        });
    };

    const updateQuantity = (index, value) => {
        const updatedItems = [...data.items];
        updatedItems[index].quantity = value;
        setData('items', updatedItems);
    };

    const submit = (e) => {
        e.preventDefault();

        const filteredItems = data.items
            .filter((item) => Number(item.quantity) > 0)
            .map((item) => ({
                sale_item_id: item.sale_item_id,
                quantity: item.quantity,
            }));

        post(route('sale-returns.store'), {
            data: {
                ...data,
                sale_header_id: selectedSale?.id,
                items: filteredItems,
            },
        });
    };

    const total = data.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.unit_price || 0);
    }, 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Create Sales Return</h2>}
        >
            <Head title="Create Sales Return" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-900">Select Sale</h3>
                                <p className="text-sm text-gray-500">
                                    Choose original invoice before creating a return.
                                </p>
                            </div>

                            <Link
                                href={route('sale-returns.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                            >
                                Back
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-3">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Invoice</label>
                                <select
                                    value={selectedSaleId}
                                    onChange={(e) => {
                                        setSelectedSaleId(e.target.value);
                                        setData('sale_header_id', e.target.value);
                                    }}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select Invoice</option>
                                    {sales.map((sale) => (
                                        <option key={sale.id} value={sale.id}>
                                            {sale.invoice_no} | {sale.sale_date} | {sale.customer?.name ?? 'Walk-in'} | {formatCurrency(sale.grand_total)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={loadSale}
                                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                                >
                                    Load Sale
                                </button>
                            </div>
                        </div>
                    </div>

                    {selectedSale && (
                        <form onSubmit={submit} className="space-y-6">
                            <div className="rounded-xl bg-white p-6 shadow">
                                <h3 className="text-lg font-semibold text-slate-900">Sale Details</h3>

                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Invoice</div>
                                        <div className="font-semibold">{selectedSale.invoice_no}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Date</div>
                                        <div className="font-semibold">{selectedSale.sale_date}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Customer</div>
                                        <div className="font-semibold">{selectedSale.customer ?? 'Walk-in'}</div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-500">Branch</div>
                                        <div className="font-semibold">{selectedSale.branch}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow">
                                <h3 className="mb-4 text-lg font-semibold text-slate-900">Return Items</h3>

                                {errors.items && (
                                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                                        {errors.items}
                                    </div>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Sold</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Already Returned</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Available</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Return Qty</th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                            {selectedSale.items.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3">{item.product_name}</td>
                                                    <td className="px-4 py-3">{item.sku}</td>
                                                    <td className="px-4 py-3 text-right">{item.sold_qty}</td>
                                                    <td className="px-4 py-3 text-right">{item.returned_qty}</td>
                                                    <td className="px-4 py-3 text-right">{item.available_qty}</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max={item.available_qty}
                                                            step="0.01"
                                                            value={data.items[index]?.quantity ?? ''}
                                                            onChange={(e) => updateQuantity(index, e.target.value)}
                                                            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-right"
                                                            disabled={item.available_qty <= 0}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        {formatCurrency(Number(data.items[index]?.quantity || 0) * Number(item.unit_price))}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="rounded-xl bg-white p-6 shadow">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Reason</label>
                                        <textarea
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            rows="3"
                                            placeholder="Optional reason"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Return Date</label>
                                        <input
                                            type="date"
                                            value={data.return_date}
                                            onChange={(e) => setData('return_date', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        />

                                        <div className="mt-6 rounded-lg bg-gray-50 p-4">
                                            <div className="text-sm text-gray-500">Total Return Amount</div>
                                            <div className="text-2xl font-bold text-slate-900">{formatCurrency(total)}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Link
                                        href={route('sale-returns.index')}
                                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                                    >
                                        Cancel
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                                    >
                                        Save Return
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
