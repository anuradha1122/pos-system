import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ customer, sales }) {
    const { auth } = usePage().props;
    const [selectedSale, setSelectedSale] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        sale_id: '',
        amount: '',
        method: 'cash',
        note: '',
    });

    const openPaymentForm = (sale) => {
        setSelectedSale(sale);

        setData({
            sale_id: sale.id,
            amount: sale.balance_amount,
            method: 'cash',
            note: '',
        });
    };

    const closePaymentForm = () => {
        setSelectedSale(null);
        reset();
    };

    const submitPayment = (e) => {
        e.preventDefault();

        post(route('customer-credits.receive-payment'), {
            onSuccess: () => {
                closePaymentForm();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Customer Credit Details</h2>}
        >
            <Head title={`Customer Credit - ${customer.name}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">{customer.name}</h1>
                                <p className="text-sm text-gray-500">
                                    Phone: {customer.phone ?? '-'}
                                </p>
                            </div>

                            <Link
                                href={route('customer-credits.index')}
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
                                            Invoice
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
                                    {sales.data.length > 0 ? (
                                        sales.data.map((sale) => (
                                            <tr key={sale.id}>
                                                <td className="px-4 py-3">{sale.invoice_no}</td>
                                                <td className="px-4 py-3">{sale.sale_date}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(sale.grand_total).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(sale.paid_amount ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-red-600">
                                                    {Number(sale.balance_amount ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded px-2 py-1 text-xs font-medium ${
                                                            sale.payment_status === 'partial'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {sale.payment_status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => openPaymentForm(sale)}
                                                        className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                                                    >
                                                        Receive Payment
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                No unpaid sales found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {sales.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {sales.links.map((link, index) => (
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

                    {selectedSale && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h2 className="mb-4 text-xl font-bold">
                                Receive Payment - {selectedSale.invoice_no}
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
