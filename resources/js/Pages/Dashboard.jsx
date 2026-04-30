import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

export default function Dashboard({
    auth,
    stats,
    summary,
    filters,
    cashFlowLast7Days = [],
    methodBreakdown = [],
    quickLinks = [],
}) {
    const [from, setFrom] = useState(filters?.from || '');
    const [to, setTo] = useState(filters?.to || '');

    const money = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const can = (permission) => auth?.permissions?.includes(permission);

    const applyFilters = (e) => {
        e.preventDefault();

        router.get(
            route('dashboard'),
            { from, to },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilters = () => {
        router.get(route('dashboard'));
    };

    const cards = [
        ['Sales', `Rs. ${money(summary?.today_sales)}`, 'border-green-200 bg-green-50'],
        ['Purchases', `Rs. ${money(summary?.today_purchases)}`, 'border-indigo-200 bg-indigo-50'],
        ['Expenses', `Rs. ${money(summary?.today_expenses)}`, 'border-red-200 bg-red-50'],
        ['Cash IN', `Rs. ${money(summary?.today_in)}`, 'border-emerald-200 bg-emerald-50'],
        ['Cash OUT', `Rs. ${money(summary?.today_out)}`, 'border-orange-200 bg-orange-50'],
        ['Net Cash', `Rs. ${money(summary?.today_net)}`, 'border-blue-200 bg-blue-50'],
        ['Receivables', `Rs. ${money(summary?.receivables_total)}`, 'border-yellow-200 bg-yellow-50'],
        ['Payables', `Rs. ${money(summary?.payables_total)}`, 'border-purple-200 bg-purple-50'],
        ['Low Stock Items', summary?.low_stock_count ?? 0, 'border-rose-200 bg-rose-50'],
    ];

    const visibleQuickLinks = quickLinks.filter((item) => can(item.permission));

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Business Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            Filtered dashboard summary. Because “today only” was getting a bit cave-dweller.
                        </p>
                    </div>

                    <form
                        onSubmit={applyFilters}
                        className="rounded-xl bg-white p-5 shadow"
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

                    {visibleQuickLinks.length > 0 && (
                        <div className="rounded-xl bg-white p-5 shadow">
                            <h3 className="mb-4 text-lg font-semibold">
                                Quick Actions
                            </h3>

                            <div className="flex flex-wrap gap-3">
                                {visibleQuickLinks.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={route(item.route)}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 xl:grid-cols-5">
                        {cards.map(([label, value, className]) => (
                            <div
                                key={label}
                                className={`rounded-xl border p-5 shadow-sm ${className}`}
                            >
                                <div className="text-sm font-medium text-gray-500">
                                    {label}
                                </div>
                                <div className="mt-2 text-xl font-bold text-gray-900">
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
                            <h3 className="mb-4 text-lg font-semibold">
                                Cash Flow
                            </h3>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={cashFlowLast7Days}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => `Rs. ${money(value)}`} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="in"
                                            name="IN"
                                            strokeWidth={2}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="out"
                                            name="OUT"
                                            strokeWidth={2}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">
                                Payment Method Breakdown
                            </h3>

                            {methodBreakdown.length > 0 ? (
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={methodBreakdown}
                                                dataKey="total"
                                                nameKey="method"
                                                outerRadius={100}
                                                label
                                            >
                                                {methodBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} />
                                                ))}
                                            </Pie>

                                            <Tooltip formatter={(value) => `Rs. ${money(value)}`} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-80 items-center justify-center text-sm text-gray-500">
                                    No payment data available.
                                </div>
                            )}
                        </div>
                    </div>

                    {can('user.view') && (
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold">
                                System Overview
                            </h3>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="rounded-xl border bg-gray-50 p-5">
                                    <p className="text-sm text-gray-500">Branches</p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats?.branches ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-gray-50 p-5">
                                    <p className="text-sm text-gray-500">Users</p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats?.users ?? 0}
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-gray-50 p-5">
                                    <p className="text-sm text-gray-500">Roles</p>
                                    <p className="mt-2 text-2xl font-bold">
                                        {stats?.roles ?? 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
