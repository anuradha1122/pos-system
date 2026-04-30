import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ closings, filters }) {
    const { auth } = usePage().props;

    const [values, setValues] = useState({
        from: filters.from || '',
        to: filters.to || '',
    });

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(route('daily-closings.index'), values, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const reset = () => {
        router.get(route('daily-closings.index'));
    };

    const isFinalized = (closing) => closing.status === 'finalized';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Daily Closings" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Daily Closings
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Close daily cash register and compare expected cash with counted cash.
                        </p>
                    </div>

                    <Link
                        href={route('daily-closings.create')}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        New Closing
                    </Link>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <input
                                type="date"
                                value={values.from}
                                onChange={(e) =>
                                    setValues({ ...values, from: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                To
                            </label>
                            <input
                                type="date"
                                value={values.to}
                                onChange={(e) =>
                                    setValues({ ...values, to: e.target.value })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <div className="flex items-end gap-2 md:col-span-2">
                            <button
                                type="submit"
                                className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-700"
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={reset}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Branch
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Opening
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Cash In
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Cash Out
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Expected
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Counted
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Variance
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Created By
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {closings.data.length > 0 ? (
                                closings.data.map((closing) => (
                                    <tr key={closing.id}>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {closing.closing_date
                                                ? closing.closing_date.slice(0, 10)
                                                : '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {closing.branch?.name || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                            Rs. {formatMoney(closing.opening_balance)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-green-700">
                                            Rs. {formatMoney(closing.cash_in)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-red-700">
                                            Rs. {formatMoney(closing.cash_out)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold">
                                            Rs. {formatMoney(closing.expected_cash)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold">
                                            Rs. {formatMoney(closing.counted_cash)}
                                        </td>

                                        <td
                                            className={`whitespace-nowrap px-4 py-3 text-right text-sm font-bold ${
                                                Number(closing.variance) === 0
                                                    ? 'text-green-700'
                                                    : 'text-red-700'
                                            }`}
                                        >
                                            Rs. {formatMoney(closing.variance)}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {closing.creator?.name || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                                    isFinalized(closing)
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                            >
                                                {isFinalized(closing) ? 'Finalized' : 'Draft'}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    href={route('daily-closings.show', closing.id)}
                                                    className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800"
                                                >
                                                    View
                                                </Link>

                                                {!isFinalized(closing) && (
                                                    <Link
                                                        href={route('daily-closings.edit', closing.id)}
                                                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="11"
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        No daily closings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {closings.links && closings.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {closings.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                preserveState
                                className={`rounded px-3 py-2 text-sm ${
                                    link.active
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white text-gray-700 shadow hover:bg-gray-100'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
