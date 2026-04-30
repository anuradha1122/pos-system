import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({
    auth,
    payments,
    summary,
    filters,
    branches,
    methods,
    types,
}) {
    const { data, setData, get } = useForm({
        from_date: filters?.from_date || '',
        to_date: filters?.to_date || '',
        branch_id: filters?.branch_id || '',
        method: filters?.method || '',
        type: filters?.type || '',
    });

    const submit = (e) => {
        e.preventDefault();

        get(route('reports.cash-flow.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        router.get(route('reports.cash-flow.index'));
    };

    const money = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const badgeClass = (type) => {
        return type === 'in'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Cash Flow Report" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Cash Flow Report
                        </h1>
                        <p className="text-sm text-gray-500">
                            Tracks real money movement from payments only.
                        </p>
                    </div>
                    {auth.permissions.includes('reports.cash_flow.export') && (
                        <a
                            href={route('reports.cash-flow.export', data)}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
                        >
                            Export Excel
                        </a>
                    )}
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <SummaryCard
                        title="Total IN"
                        value={`Rs. ${money(summary.total_in)}`}
                        className="border-green-200 bg-green-50"
                    />

                    <SummaryCard
                        title="Total OUT"
                        value={`Rs. ${money(summary.total_out)}`}
                        className="border-red-200 bg-red-50"
                    />

                    <SummaryCard
                        title="Net Cash Flow"
                        value={`Rs. ${money(summary.net_cash_flow)}`}
                        className="border-blue-200 bg-blue-50"
                    />

                    <SummaryCard
                        title="Cash Total"
                        value={`Rs. ${money(summary.cash_total)}`}
                        className="border-gray-200 bg-white"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="Card Total"
                        value={`Rs. ${money(summary.card_total)}`}
                        className="border-gray-200 bg-white"
                    />

                    <SummaryCard
                        title="Bank Total"
                        value={`Rs. ${money(summary.bank_total)}`}
                        className="border-gray-200 bg-white"
                    />

                    <SummaryCard
                        title="Credit Total"
                        value={`Rs. ${money(summary.credit_total)}`}
                        className="border-gray-200 bg-white"
                    />
                </div>

                <div className="mb-6 rounded bg-white p-4 shadow">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                From Date
                            </label>
                            <input
                                type="date"
                                value={data.from_date}
                                onChange={(e) => setData('from_date', e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                To Date
                            </label>
                            <input
                                type="date"
                                value={data.to_date}
                                onChange={(e) => setData('to_date', e.target.value)}
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Branch
                            </label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Method
                            </label>
                            <select
                                value={data.method}
                                onChange={(e) => setData('method', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Methods</option>
                                {methods.map((method) => (
                                    <option key={method} value={method}>
                                        {method.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Type
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Types</option>
                                {types.map((type) => (
                                    <option key={type} value={type}>
                                        {type.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="rounded bg-slate-900 px-4 py-2 text-white"
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded bg-gray-200 px-4 py-2 text-gray-700"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHead>Date</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Note</TableHead>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {payments.data.length > 0 ? (
                                payments.data.map((payment) => (
                                    <tr key={payment.id}>
                                        <TableCell>
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell>
                                            <div className="font-medium">
                                                {payment.reference_type}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                #{payment.reference_id}
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-semibold ${badgeClass(payment.type)}`}
                                            >
                                                {payment.type.toUpperCase()}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {payment.method?.toUpperCase()}
                                        </TableCell>

                                        <TableCell>
                                            Rs. {money(payment.amount)}
                                        </TableCell>

                                        <TableCell>
                                            {payment.branch?.name || '-'}
                                        </TableCell>

                                        <TableCell>
                                            {payment.creator?.name || '-'}
                                        </TableCell>

                                        <TableCell>
                                            {payment.note || '-'}
                                        </TableCell>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No cash flow records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {payments.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ title, value, className }) {
    return (
        <div className={`rounded border p-4 shadow-sm ${className}`}>
            <div className="text-sm text-gray-500">{title}</div>
            <div className="mt-1 text-xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function TableHead({ children }) {
    return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
            {children}
        </th>
    );
}

function TableCell({ children }) {
    return (
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
            {children}
        </td>
    );
}
