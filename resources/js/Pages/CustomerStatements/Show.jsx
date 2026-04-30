import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ auth, statement }) {
    const { customer, transactions, summary, filters } = statement;

    const [from, setFrom] = useState(filters?.from || '');
    const [to, setTo] = useState(filters?.to || '');

    const money = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route('customer-statements.show', customer.id),
            { from, to },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilters = () => {
        router.get(route('customer-statements.show', customer.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Customer Statement - ${customer.name}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Customer Statement</h1>
                        <p className="text-sm text-gray-500">{customer.name}</p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={route('customer-statements.index')}
                            className="rounded bg-gray-200 px-4 py-2 text-sm"
                        >
                            Back
                        </Link>

                        <a
                            href={route('customer-statements.pdf', {
                                customer: customer.id,
                                from,
                                to,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                        >
                            PDF
                        </a>

                        <button
                            onClick={() => window.print()}
                            className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Print
                        </button>
                    </div>
                </div>

                <form
                    onSubmit={applyFilters}
                    className="mb-6 rounded bg-white p-4 shadow"
                >
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                From
                            </label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                To
                            </label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
                            >
                                Apply
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded bg-gray-200 px-4 py-2 text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Sales</p>
                        <p className="mt-1 text-2xl font-bold">
                            {money(summary.total_sales)}
                        </p>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Total Paid / Returned</p>
                        <p className="mt-1 text-2xl font-bold text-green-700">
                            {money(summary.total_paid)}
                        </p>
                    </div>

                    <div className="rounded bg-white p-5 shadow">
                        <p className="text-sm text-gray-500">Outstanding Balance</p>
                        <p
                            className={`mt-1 text-2xl font-bold ${
                                summary.outstanding > 0
                                    ? 'text-red-700'
                                    : 'text-green-700'
                            }`}
                        >
                            {money(summary.outstanding)}
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Reference</th>
                                <th className="p-3">Description</th>
                                <th className="p-3 text-right">Debit</th>
                                <th className="p-3 text-right">Credit</th>
                                <th className="p-3 text-right">Balance</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-3">
                                        {new Date(item.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">{item.type}</td>
                                    <td className="p-3">{item.reference}</td>
                                    <td className="p-3">{item.description || '-'}</td>
                                    <td className="p-3 text-right">
                                        {item.debit > 0 ? money(item.debit) : '-'}
                                    </td>
                                    <td className="p-3 text-right">
                                        {item.credit > 0 ? money(item.credit) : '-'}
                                    </td>
                                    <td className="p-3 text-right font-semibold">
                                        {money(item.balance)}
                                    </td>
                                </tr>
                            ))}

                            {transactions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No statement records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
