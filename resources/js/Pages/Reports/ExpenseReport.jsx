import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function ExpenseReport({
    expenses,
    summary,
    categoryTotals,
    methodTotals,
    filters,
    categories,
    methods,
}) {
    const { auth } = usePage().props;

    const [values, setValues] = useState({
        from: filters.from || '',
        to: filters.to || '',
        category: filters.category || '',
        method: filters.method || '',
    });

    const formatMoney = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        router.get(route('reports.expenses'), values, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const reset = () => {
        router.get(route('reports.expenses'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Expense Report" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Expense Report
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Track business expenses by date, category, and payment method.
                        </p>
                    </div>

                    <a
                        href={route('reports.expenses.export', values)}
                        className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                    >
                        Export Excel
                    </a>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow">
                        <div className="text-sm text-gray-500">
                            Total Expenses
                        </div>
                        <div className="mt-2 text-2xl font-bold text-red-700">
                            Rs. {formatMoney(summary.total_expense)}
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow md:col-span-2">
                        <div className="text-sm font-semibold text-gray-700">
                            Expense Breakdown
                        </div>
                        <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                                    By Category
                                </div>
                                {categoryTotals.length > 0 ? (
                                    <div className="space-y-2">
                                        {categoryTotals.map((row) => (
                                            <div
                                                key={row.category}
                                                className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm"
                                            >
                                                <span>{row.category}</span>
                                                <span className="font-semibold">
                                                    Rs. {formatMoney(row.total)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No category data.
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                                    By Method
                                </div>
                                {methodTotals.length > 0 ? (
                                    <div className="space-y-2">
                                        {methodTotals.map((row) => (
                                            <div
                                                key={row.method}
                                                className="flex justify-between rounded bg-gray-50 px-3 py-2 text-sm"
                                            >
                                                <span className="capitalize">
                                                    {row.method}
                                                </span>
                                                <span className="font-semibold">
                                                    Rs. {formatMoney(row.total)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No method data.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-6 rounded-xl bg-white p-5 shadow">
                    <form
                        onSubmit={submit}
                        className="grid grid-cols-1 gap-4 md:grid-cols-6"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                From
                            </label>
                            <input
                                type="date"
                                value={values.from}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        from: e.target.value,
                                    })
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
                                    setValues({
                                        ...values,
                                        to: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                value={values.category}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        category: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Method
                            </label>
                            <select
                                value={values.method}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        method: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All</option>
                                {methods.map((method) => (
                                    <option key={method} value={method}>
                                        {method.charAt(0).toUpperCase() +
                                            method.slice(1)}
                                    </option>
                                ))}
                            </select>
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
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Method
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Note
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                                    Created By
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {expenses.data.length > 0 ? (
                                expenses.data.map((expense) => (
                                    <tr key={expense.id}>
                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {expense.expense_date
                                                ? expense.expense_date.slice(0, 10)
                                                : '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {expense.branch?.name || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-800">
                                            {expense.category}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm capitalize text-gray-700">
                                            {expense.method}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-semibold text-red-700">
                                            Rs. {formatMoney(expense.amount)}
                                        </td>

                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {expense.note || '-'}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                                            {expense.creator?.name || '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-4 py-8 text-center text-sm text-gray-500"
                                    >
                                        No expenses found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {expenses.links && expenses.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {expenses.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                preserveScroll
                                preserveState
                                className={`rounded px-3 py-2 text-sm ${
                                    link.active
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white text-gray-700 shadow hover:bg-gray-100'
                                } ${
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
