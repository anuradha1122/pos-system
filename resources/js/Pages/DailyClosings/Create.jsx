import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Create({ defaultDate, calculated }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        closing_date: defaultDate || new Date().toISOString().slice(0, 10),
        opening_balance: '0',
        counted_cash: '0',
        note: '',
    });

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const refreshCalculation = () => {
        router.get(
            route('daily-closings.create'),
            {
                closing_date: data.closing_date,
                opening_balance: data.opening_balance || 0,
                counted_cash: data.counted_cash || 0,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('daily-closings.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Create Daily Closing" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Create Daily Closing
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Calculate expected cash from cash payments and compare with counted cash.
                        </p>
                    </div>

                    <Link
                        href={route('daily-closings.index')}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Back
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Closing Date
                                </label>
                                <input
                                    type="date"
                                    value={data.closing_date}
                                    onChange={(e) => setData('closing_date', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.closing_date && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.closing_date}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Opening Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.opening_balance}
                                    onChange={(e) => setData('opening_balance', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.opening_balance && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.opening_balance}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Counted Cash
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.counted_cash}
                                    onChange={(e) => setData('counted_cash', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.counted_cash && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.counted_cash}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Note
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.note}
                                    onChange={(e) => setData('note', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                />
                                {errors.note && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.note}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={refreshCalculation}
                                    className="rounded-lg border border-gray-300 px-5 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Recalculate
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-slate-900 px-5 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Closing'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Cash In</div>
                            <div className="mt-2 text-2xl font-bold text-green-700">
                                Rs. {formatMoney(calculated.cash_in)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Cash Out</div>
                            <div className="mt-2 text-2xl font-bold text-red-700">
                                Rs. {formatMoney(calculated.cash_out)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Expected Cash</div>
                            <div className="mt-2 text-2xl font-bold text-slate-900">
                                Rs. {formatMoney(calculated.expected_cash)}
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-5 shadow">
                            <div className="text-sm text-gray-500">Variance</div>
                            <div
                                className={`mt-2 text-2xl font-bold ${
                                    Number(calculated.variance) === 0
                                        ? 'text-green-700'
                                        : 'text-red-700'
                                }`}
                            >
                                Rs. {formatMoney(calculated.variance)}
                            </div>
                        </div>

                        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
                            Click <strong>Recalculate</strong> after changing date, opening balance,
                            or counted cash. Yes, a live auto-calc would be nicer. We are building
                            safely first, not juggling knives.
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
