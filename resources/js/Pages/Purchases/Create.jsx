import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, branches, suppliers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        branch_id: '',
        supplier_id: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        invoice_no: '',
        note: '',
        paid_amount: '',
        payment_method: 'cash',
        items: [
            {
                product_id: '',
                quantity: '',
                cost_price: '',
            },
        ],
    });

    const addItemRow = () => {
        setData('items', [
            ...data.items,
            {
                product_id: '',
                quantity: '',
                cost_price: '',
            },
        ]);
    };

    const removeItemRow = (index) => {
        if (data.items.length === 1) return;

        const updatedItems = [...data.items];
        updatedItems.splice(index, 1);
        setData('items', updatedItems);
    };

    const updateItem = (index, field, value) => {
        const updatedItems = [...data.items];
        updatedItems[index][field] = value;

        if (field === 'product_id') {
            const selectedProduct = products.find(
                (product) => String(product.id) === String(value)
            );

            if (selectedProduct) {
                updatedItems[index].cost_price = selectedProduct.cost_price ?? '';
            }
        }

        setData('items', updatedItems);
    };

    const totalAmount = data.items.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity || 0);
        const costPrice = parseFloat(item.cost_price || 0);
        return sum + quantity * costPrice;
    }, 0);

    const balanceAmount = totalAmount - Number(data.paid_amount || 0);

    const submit = (e) => {
        e.preventDefault();
        post(route('purchases.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Create Purchase</h2>}
        >
            <Head title="Create Purchase" />

            <div className="space-y-6 p-6">
                <div className="rounded-xl bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                                {errors.branch_id && (
                                    <div className="mt-1 text-sm text-red-600">{errors.branch_id}</div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Supplier</label>
                                <select
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select supplier</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.id} value={supplier.id}>
                                            {supplier.name}
                                            {supplier.company_name ? ` - ${supplier.company_name}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && (
                                    <div className="mt-1 text-sm text-red-600">{errors.supplier_id}</div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Purchase Date</label>
                                <input
                                    type="date"
                                    value={data.purchase_date}
                                    onChange={(e) => setData('purchase_date', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.purchase_date && (
                                    <div className="mt-1 text-sm text-red-600">{errors.purchase_date}</div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Invoice No</label>
                                <input
                                    type="text"
                                    value={data.invoice_no}
                                    onChange={(e) => setData('invoice_no', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.invoice_no && (
                                    <div className="mt-1 text-sm text-red-600">{errors.invoice_no}</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
                            <textarea
                                rows="3"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.note && (
                                <div className="mt-1 text-sm text-red-600">{errors.note}</div>
                            )}
                        </div>

                        <div className="rounded-lg border border-gray-200">
                            <div className="border-b border-gray-200 px-4 py-3 font-medium text-gray-800">
                                Purchase Items
                            </div>

                            <div className="space-y-4 p-4">
                                {data.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 p-4 md:grid-cols-4"
                                    >
                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Product
                                            </label>
                                            <select
                                                value={item.product_id}
                                                onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            >
                                                <option value="">Select product</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name} ({product.sku})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`items.${index}.product_id`] && (
                                                <div className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.product_id`]}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0.01"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />
                                            {errors[`items.${index}.quantity`] && (
                                                <div className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.quantity`]}
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Cost Price
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.cost_price}
                                                onChange={(e) => updateItem(index, 'cost_price', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                            />
                                            {errors[`items.${index}.cost_price`] && (
                                                <div className="mt-1 text-sm text-red-600">
                                                    {errors[`items.${index}.cost_price`]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-end">
                                            <button
                                                type="button"
                                                onClick={() => removeItemRow(index)}
                                                disabled={data.items.length === 1}
                                                className="rounded-lg border border-red-300 px-4 py-2 text-red-600 disabled:opacity-50"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={addItemRow}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                                >
                                    Add Item
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="text-sm text-gray-500">Total</div>
                                <div className="text-xl font-bold text-slate-900">
                                    {totalAmount.toFixed(2)}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="text-sm text-gray-500">Paid</div>
                                <div className="text-xl font-bold text-slate-900">
                                    {Number(data.paid_amount || 0).toFixed(2)}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="text-sm text-gray-500">Balance</div>
                                <div className="text-xl font-bold text-slate-900">
                                    {balanceAmount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Paid Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.paid_amount}
                                    onChange={(e) => setData('paid_amount', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    placeholder="0.00"
                                />
                                {errors.paid_amount && (
                                    <div className="mt-1 text-sm text-red-600">{errors.paid_amount}</div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Payment Method</label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Bank</option>
                                    <option value="credit">Credit</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Purchase'}
                            </button>

                            <Link
                                href={route('purchases.index')}
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
