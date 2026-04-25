import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ supplier, purchases }) {
    const { auth } = usePage().props;
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        purchase_id: '',
        amount: '',
        method: 'cash',
        note: '',
    });

    const openPaymentForm = (purchase) => {
        setSelectedPurchase(purchase);

        setData({
            purchase_id: purchase.id,
            amount: purchase.balance_amount,
            method: 'cash',
            note: '',
        });
    };

    const closePaymentForm = () => {
        setSelectedPurchase(null);
        reset();
    };

    const submitPayment = (e) => {
        e.preventDefault();

        post(route('supplier-credits.make-payment'), {
            onSuccess: () => {
                closePaymentForm();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Supplier Credit Details</h2>}
        >
            <Head title={`Supplier Credit - ${supplier.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{supplier.name}</h1>
                                <p className="text-sm text-gray-500">
                                    Phone: {supplier.phone ?? '-'}
                                </p>
                            </div>

                            <Link
                                href={route('supplier-credits.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2"
                            >
                                Back
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Purchase No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Invoice No
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Total
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Paid
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Balance
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {purchases.data.length > 0 ? (
                                        purchases.data.map((purchase) => (
                                            <tr key={purchase.id}>
                                                <td className="px-4 py-3">
                                                    {purchase.purchase_no ?? purchase.id}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {purchase.invoice_no ?? '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {purchase.purchase_date}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(purchase.total_amount).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(purchase.paid_amount ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-red-600">
                                                    {Number(purchase.balance_amount ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                                            purchase.payment_status === 'partial'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {purchase.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => openPaymentForm(purchase)}
                                                        className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                                                    >
                                                        Make Payment
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                No unpaid purchases found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {purchases.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {purchases.links.map((link, index) => (
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

                    {selectedPurchase && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-xl font-bold">
                                Make Payment - {selectedPurchase.invoice_no ?? `Purchase #${selectedPurchase.id}`}
                            </h2>

                            <form onSubmit={submitPayment} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Method
                                    </label>
                                    <select
                                        value={data.method}
                                        onChange={(e) => setData('method', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="bank">Bank</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Note
                                    </label>
                                    <input
                                        type="text"
                                        value={data.note}
                                        onChange={(e) => setData('note', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                                    >
                                        Save Payment
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closePaymentForm}
                                        className="rounded-lg border border-gray-300 px-4 py-2"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
