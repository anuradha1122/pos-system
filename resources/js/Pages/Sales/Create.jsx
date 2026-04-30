import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Create({ customers, products }) {
    const { auth } = usePage().props;

    const formRef = useRef(null);
    const productSearchRef = useRef(null);
    const paidAmountRef = useRef(null);

    const { data, setData, post, processing, errors, transform } = useForm({
        customer_id: '',
        sale_date: new Date().toISOString().slice(0, 10),
        discount: 0,
        tax: 0,
        paid_amount: '',
        payment_method: 'cash',
        notes: '',
        items: [],
    });

    const [productSearch, setProductSearch] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const subtotal = data.items.reduce((sum, item) => {
        return sum + Number(item.quantity || 0) * Number(item.unit_price || 0);
    }, 0);

    const grandTotal =
        subtotal - Number(data.discount || 0) + Number(data.tax || 0);

    const balance =
        grandTotal - Number(data.paid_amount || 0);

    const filteredProducts = useMemo(() => {
        if (!productSearch.trim()) return [];

        const search = productSearch.toLowerCase().trim();

        return products
            .filter((product) => {
                return (
                    product.name?.toLowerCase().includes(search) ||
                    product.sku?.toLowerCase().includes(search) ||
                    product.barcode?.toLowerCase().includes(search)
                );
            })
            .slice(0, 10);
    }, [products, productSearch]);

    const exactProduct = useMemo(() => {
        if (!productSearch.trim()) return null;

        const search = productSearch.toLowerCase().trim();

        return products.find((product) => {
            return (
                String(product.sku || '').toLowerCase() === search ||
                String(product.barcode || '').toLowerCase() === search
            );
        });
    }, [products, productSearch]);

    const addProductToCart = (product) => {
        if (!product) return;

        const existingIndex = data.items.findIndex(
            (item) => String(item.product_id) === String(product.product_id)
        );

        if (existingIndex >= 0) {
            const updated = [...data.items];
            updated[existingIndex].quantity =
                Number(updated[existingIndex].quantity || 0) + 1;

            setData('items', updated);
        } else {
            setData('items', [
                ...data.items,
                {
                    product_id: product.product_id,
                    product_name: product.name,
                    sku: product.sku,
                    barcode: product.barcode,
                    available_qty: product.available_qty,
                    quantity: 1,
                    unit_price: product.selling_price ?? 0,
                },
            ]);
        }

        setProductSearch('');
        setHighlightedIndex(0);

        setTimeout(() => {
            productSearchRef.current?.focus();
        }, 50);
    };

    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index][field] = value;
        setData('items', updated);
    };

    const removeItem = (index) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index)
        );
    };

    const removeLastItem = () => {
        if (data.items.length === 0) return;
        setData('items', data.items.slice(0, -1));
    };

    const increaseLastItemQty = () => {
        if (data.items.length === 0) return;

        const updated = [...data.items];
        const lastIndex = updated.length - 1;

        updated[lastIndex].quantity =
            Number(updated[lastIndex].quantity || 0) + 1;

        setData('items', updated);
    };

    const decreaseLastItemQty = () => {
        if (data.items.length === 0) return;

        const updated = [...data.items];
        const lastIndex = updated.length - 1;

        const currentQty = Number(updated[lastIndex].quantity || 0);

        if (currentQty <= 1) return;

        updated[lastIndex].quantity = currentQty - 1;

        setData('items', updated);
    };

    const handleProductSearchKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();

            if (filteredProducts.length === 0) return;

            setHighlightedIndex((current) =>
                current + 1 >= filteredProducts.length ? 0 : current + 1
            );
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();

            if (filteredProducts.length === 0) return;

            setHighlightedIndex((current) =>
                current - 1 < 0 ? filteredProducts.length - 1 : current - 1
            );
        }

        if (e.key === 'Enter') {
            e.preventDefault();

            if (exactProduct) {
                addProductToCart(exactProduct);
                return;
            }

            if (filteredProducts[highlightedIndex]) {
                addProductToCart(filteredProducts[highlightedIndex]);
            }
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            setProductSearch('');
            setHighlightedIndex(0);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            items: formData.items.map((item) => ({
                product_id: item.product_id,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
            })),
            discount: Number(formData.discount || 0),
            tax: Number(formData.tax || 0),
            paid_amount: Number(formData.paid_amount || 0),
            payment_method: formData.payment_method || 'cash',
        }));

        post(route('sales.store'), {
            preserveScroll: true,
        });
    };

    useEffect(() => {
        productSearchRef.current?.focus();
    }, []);

    useEffect(() => {
        const handleShortcut = (e) => {
            const activeTag = document.activeElement?.tagName?.toLowerCase();
            const isTyping =
                activeTag === 'input' ||
                activeTag === 'textarea' ||
                activeTag === 'select';

            if (e.key === 'F2') {
                e.preventDefault();
                productSearchRef.current?.focus();
            }

            if (e.key === 'F4') {
                e.preventDefault();
                paidAmountRef.current?.focus();
            }

            if (e.key === 'F6') {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }

            if (e.key === 'Escape') {
                setProductSearch('');
                setHighlightedIndex(0);
            }

            if (e.ctrlKey && e.key === 'Backspace') {
                e.preventDefault();
                removeLastItem();
            }

            if (!isTyping && e.key === '+') {
                e.preventDefault();
                increaseLastItemQty();
            }

            if (!isTyping && e.key === '-') {
                e.preventDefault();
                decreaseLastItemQty();
            }
        };

        window.addEventListener('keydown', handleShortcut);

        return () => {
            window.removeEventListener('keydown', handleShortcut);
        };
    }, [data.items]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Create Sale
                    </h2>

                    <div className="text-xs text-gray-500">
                        F2 Product Search • F4 Paid Amount • F6 Complete Sale
                    </div>
                </div>
            }
        >
            <Head title="Create Sale" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form ref={formRef} onSubmit={submit} className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Customer
                                    </label>

                                    <select
                                        value={data.customer_id}
                                        onChange={(e) =>
                                            setData('customer_id', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">Walk-in Customer</option>

                                        {customers.map((customer) => (
                                            <option
                                                key={customer.id}
                                                value={customer.id}
                                            >
                                                {customer.name} - {customer.phone}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.customer_id && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.customer_id}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Sale Date
                                    </label>

                                    <input
                                        type="date"
                                        value={data.sale_date}
                                        onChange={(e) =>
                                            setData('sale_date', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />

                                    {errors.sale_date && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.sale_date}
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500">
                                        Items
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {data.items.length}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-slate-900 p-4 text-white">
                                    <div className="text-xs text-gray-300">
                                        Grand Total
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {grandTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                                <div className="relative md:col-span-4">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Product Search / Barcode / SKU
                                    </label>

                                    <input
                                        ref={productSearchRef}
                                        type="text"
                                        value={productSearch}
                                        onChange={(e) => {
                                            setProductSearch(e.target.value);
                                            setHighlightedIndex(0);
                                        }}
                                        onKeyDown={handleProductSearchKeyDown}
                                        placeholder="Scan barcode, type SKU, or search product name..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-3 text-base focus:border-slate-900 focus:ring-slate-900"
                                    />

                                    {filteredProducts.length > 0 && (
                                        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                                            {filteredProducts.map((product, index) => (
                                                <button
                                                    type="button"
                                                    key={product.product_id}
                                                    onMouseEnter={() =>
                                                        setHighlightedIndex(index)
                                                    }
                                                    onClick={() =>
                                                        addProductToCart(product)
                                                    }
                                                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm ${
                                                        highlightedIndex === index
                                                            ? 'bg-slate-900 text-white'
                                                            : 'hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="font-medium">
                                                            {product.name}
                                                        </div>
                                                        <div
                                                            className={`text-xs ${
                                                                highlightedIndex === index
                                                                    ? 'text-gray-200'
                                                                    : 'text-gray-500'
                                                            }`}
                                                        >
                                                            SKU: {product.sku || '-'} | Barcode:{' '}
                                                            {product.barcode || '-'}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="font-semibold">
                                                            {Number(
                                                                product.selling_price || 0
                                                            ).toFixed(2)}
                                                        </div>
                                                        <div
                                                            className={`text-xs ${
                                                                Number(
                                                                    product.available_qty || 0
                                                                ) <= 0
                                                                    ? 'text-red-500'
                                                                    : highlightedIndex === index
                                                                      ? 'text-gray-200'
                                                                      : 'text-gray-500'
                                                            }`}
                                                        >
                                                            Stock: {product.available_qty}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (exactProduct) {
                                                addProductToCart(exactProduct);
                                                return;
                                            }

                                            if (filteredProducts[highlightedIndex]) {
                                                addProductToCart(
                                                    filteredProducts[highlightedIndex]
                                                );
                                            }
                                        }}
                                        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                                    >
                                        Add Item
                                    </button>
                                </div>
                            </div>

                            <div className="mt-3 rounded-lg bg-gray-50 px-4 py-3 text-xs text-gray-600">
                                Shortcuts: F2 focus product • Enter add product • F4
                                paid amount • F6 complete sale • Ctrl + Backspace
                                remove last item • + / - adjust last item quantity
                            </div>

                            <div className="mt-6 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Product
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Available
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Qty
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Price
                                            </th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Total
                                            </th>
                                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data.items.length > 0 ? (
                                            data.items.map((item, index) => (
                                                <tr key={item.product_id}>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium text-gray-900">
                                                            {item.product_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            SKU: {item.sku || '-'} | Barcode:{' '}
                                                            {item.barcode || '-'}
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        {item.available_qty}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0.01"
                                                            step="0.01"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'quantity',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-24 rounded-lg border border-gray-300 px-3 py-2"
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={item.unit_price}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    index,
                                                                    'unit_price',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-28 rounded-lg border border-gray-300 px-3 py-2"
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3 font-semibold">
                                                        {(
                                                            Number(item.quantity || 0) *
                                                            Number(item.unit_price || 0)
                                                        ).toFixed(2)}
                                                    </td>

                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeItem(index)
                                                            }
                                                            className="text-sm text-red-600 hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-4 py-8 text-center text-sm text-gray-500"
                                                >
                                                    No items added yet. Use barcode,
                                                    SKU, or product search above.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {errors.items && (
                                <div className="mt-3 text-sm text-red-600">
                                    {errors.items}
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Discount
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.discount}
                                        onChange={(e) =>
                                            setData('discount', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Tax
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.tax}
                                        onChange={(e) =>
                                            setData('tax', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Paid Amount
                                    </label>

                                    <input
                                        ref={paidAmountRef}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.paid_amount}
                                        onChange={(e) =>
                                            setData('paid_amount', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="0.00"
                                    />

                                    {errors.paid_amount && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.paid_amount}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Payment Method
                                    </label>

                                    <select
                                        value={data.payment_method}
                                        onChange={(e) =>
                                            setData('payment_method', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="bank">Bank</option>
                                        <option value="credit">Credit</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500">
                                        Subtotal
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">
                                        {subtotal.toFixed(2)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="text-xs text-gray-500">
                                        Balance
                                    </div>
                                    <div
                                        className={`text-xl font-bold ${
                                            balance > 0
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                        }`}
                                    >
                                        {balance.toFixed(2)}
                                    </div>
                                </div>

                                <div className="rounded-lg bg-slate-900 p-4 text-white">
                                    <div className="text-xs text-gray-300">
                                        Grand Total
                                    </div>
                                    <div className="text-2xl font-bold">
                                        {grandTotal.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Notes
                                </label>

                                <textarea
                                    value={data.notes}
                                    onChange={(e) =>
                                        setData('notes', e.target.value)
                                    }
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || data.items.length === 0}
                                    className="rounded-lg bg-slate-900 px-6 py-3 text-white disabled:opacity-50"
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
