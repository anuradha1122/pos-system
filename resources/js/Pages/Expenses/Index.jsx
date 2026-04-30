import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ expenses, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');

    const money = (value) => Number(value || 0).toFixed(2);

    const submitSearch = (e) => {
        e.preventDefault();

        router.get(route('expenses.index'), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Expenses</h2>}
        >
            <Head title="Expenses" />

            <div className="p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <form onSubmit={submitSearch} className="flex gap-2">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search category or note..."
                            className="rounded-lg border border-gray-300 px-3 py-2"
                        />

                        <button className="rounded-lg bg-slate-900 px-4 py-2 text-white">
                            Search
                        </button>
                    </form>

                    <Link
                        href={route('expenses.create')}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                    >
                        Add Expense
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Branch</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Created By</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Note</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {expenses.data.length > 0 ? (
                                expenses.data.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="px-4 py-3">{expense.expense_date}</td>
                                        <td className="px-4 py-3">{expense.branch?.name ?? '-'}</td>
                                        <td className="px-4 py-3">{expense.category}</td>
                                        <td className="px-4 py-3 capitalize">{expense.method}</td>
                                        <td className="px-4 py-3 text-right font-medium">
                                            {money(expense.amount)}
                                        </td>
                                        <td className="px-4 py-3">{expense.creator?.name ?? '-'}</td>
                                        <td className="px-4 py-3">{expense.note ?? '-'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                                            <Link
                                                href={route('expenses.edit', expense.id)}
                                                className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {expenses.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-gray-700'
                            } disabled:opacity-50`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
