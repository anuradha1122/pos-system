import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Show({ closing }) {
    const { auth } = usePage().props;

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const printPage = () => {
        window.print();
    };

    const finalizeClosing = () => {
        if (!confirm('Finalize this daily closing? After finalizing, it cannot be edited.')) {
            return;
        }

        router.post(route('daily-closings.finalize', closing.id));
    };

    const isFinalized = closing.status === 'finalized';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Daily Closing #${closing.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between print:hidden">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Daily Closing #{closing.id}
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            View and print daily cash closing summary.
                        </p>

                        <div className="mt-3">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isFinalized
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {isFinalized ? 'Finalized' : 'Draft'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={printPage}
                            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                        >
                            Print
                        </button>

                        {!isFinalized && (
                            <>
                                <button
                                    onClick={finalizeClosing}
                                    className="rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
                                >
                                    Finalize
                                </button>

                                <Link
                                    href={route('daily-closings.edit', closing.id)}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Edit
                                </Link>
                            </>
                        )}

                        <Link
                            href={route('daily-closings.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow print:shadow-none">
                    <div className="border-b pb-5 text-center">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Daily Cash Closing Summary
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Closing Date: {closing.closing_date?.slice(0, 10)}
                        </p>

                        <div className="mt-3 print:hidden">
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    isFinalized
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                {isFinalized ? 'Finalized' : 'Draft'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div>
                            <div className="text-gray-500">Branch</div>
                            <div className="font-semibold text-gray-900">
                                {closing.branch?.name || '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Created By</div>
                            <div className="font-semibold text-gray-900">
                                {closing.creator?.name || '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Created At</div>
                            <div className="font-semibold text-gray-900">
                                {closing.created_at
                                    ? closing.created_at.slice(0, 19).replace('T', ' ')
                                    : '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Updated At</div>
                            <div className="font-semibold text-gray-900">
                                {closing.updated_at
                                    ? closing.updated_at.slice(0, 19).replace('T', ' ')
                                    : '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Finalized By</div>
                            <div className="font-semibold text-gray-900">
                                {closing.finalizer?.name || '-'}
                            </div>
                        </div>

                        <div>
                            <div className="text-gray-500">Finalized At</div>
                            <div className="font-semibold text-gray-900">
                                {closing.finalized_at
                                    ? closing.finalized_at.slice(0, 19).replace('T', ' ')
                                    : '-'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 overflow-hidden rounded-lg border">
                        <table className="min-w-full divide-y divide-gray-200">
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Opening Balance
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold">
                                        Rs. {formatMoney(closing.opening_balance)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Cash In
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-700">
                                        Rs. {formatMoney(closing.cash_in)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Cash Out
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-red-700">
                                        Rs. {formatMoney(closing.cash_out)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Expected Cash
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        Rs. {formatMoney(closing.expected_cash)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Counted Cash
                                    </td>
                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                        Rs. {formatMoney(closing.counted_cash)}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-700">
                                        Variance
                                    </td>
                                    <td
                                        className={`px-4 py-3 text-right font-bold ${
                                            Number(closing.variance) === 0
                                                ? 'text-green-700'
                                                : 'text-red-700'
                                        }`}
                                    >
                                        Rs. {formatMoney(closing.variance)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {closing.note && (
                        <div className="mt-6">
                            <div className="mb-1 text-sm font-medium text-gray-700">
                                Note
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                                {closing.note}
                            </div>
                        </div>
                    )}

                    <div className="mt-10 grid grid-cols-2 gap-8 text-sm">
                        <div className="border-t pt-2 text-center text-gray-600">
                            Cashier Signature
                        </div>

                        <div className="border-t pt-2 text-center text-gray-600">
                            Manager Signature
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
