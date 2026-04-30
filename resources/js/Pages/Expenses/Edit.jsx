import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, expense }) {
    const { data, setData, put, processing, errors } = useForm({
        expense_date: expense.expense_date ?? '',
        category: expense.category ?? '',
        amount: expense.amount ?? '',
        method: expense.method ?? 'cash',
        note: expense.note ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        put(route('expenses.update', expense.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Expense" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Edit Expense
                    </h1>

                    <Link
                        href={route('expenses.index')}
                        className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                    >
                        Back
                    </Link>
                </div>

                <div className="rounded bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Expense Date
                            </label>
                            <input
                                type="date"
                                value={data.expense_date}
                                onChange={(e) => setData('expense_date', e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                            {errors.expense_date && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.expense_date}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <input
                                type="text"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full rounded border-gray-300"
                                placeholder="Example: Rent, Transport, Electricity"
                            />
                            {errors.category && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.category}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                            {errors.amount && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.amount}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Payment Method
                            </label>
                            <select
                                value={data.method}
                                onChange={(e) => setData('method', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank">Bank</option>
                                <option value="credit">Credit</option>
                            </select>
                            {errors.method && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.method}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Note
                            </label>
                            <textarea
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                                className="w-full rounded border-gray-300"
                                rows="4"
                            />
                            {errors.note && (
                                <div className="mt-1 text-sm text-red-600">
                                    {errors.note}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Link
                                href={route('expenses.index')}
                                className="rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
                            >
                                Update Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
