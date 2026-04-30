import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Create() {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        expense_date: new Date().toISOString().slice(0, 10),
        category: '',
        amount: '',
        method: 'cash',
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('expenses.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Add Expense</h2>}
        >
            <Head title="Add Expense" />

            <div className="p-6">
                <div className="max-w-3xl rounded-xl bg-white p-6 shadow">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium">Expense Date</label>
                            <input
                                type="date"
                                value={data.expense_date}
                                onChange={(e) => setData('expense_date', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.expense_date && (
                                <div className="mt-1 text-sm text-red-600">{errors.expense_date}</div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Category</label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">Select category</option>
                                <option value="Rent">Rent</option>
                                <option value="Salary">Salary</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water">Water</option>
                                <option value="Internet">Internet</option>
                                <option value="Transport">Transport</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Other">Other</option>
                            </select>
                            {errors.category && (
                                <div className="mt-1 text-sm text-red-600">{errors.category}</div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                            {errors.amount && (
                                <div className="mt-1 text-sm text-red-600">{errors.amount}</div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Payment Method</label>
                            <select
                                value={data.method}
                                onChange={(e) => setData('method', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="bank">Bank</option>
                                <option value="credit">Credit</option>
                            </select>
                            {errors.method && (
                                <div className="mt-1 text-sm text-red-600">{errors.method}</div>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">Note</label>
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

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-slate-900 px-5 py-2 text-white disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Expense'}
                            </button>

                            <Link
                                href={route('expenses.index')}
                                className="rounded-lg border border-gray-300 px-5 py-2"
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
