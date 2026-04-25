import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function Index({ returns, filters }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');

    const apply = () => {
        router.get(route('sale-returns.index'), { search }, {
            preserveState: true,
            replace: true,
        });
    };

    const reset = () => {
        setSearch('');
        router.get(route('sale-returns.index'), {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Sales Returns</h2>}
        >
            <Head title="Sales Returns" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Sales Returns</h3>
                            <p className="text-sm text-gray-500">
                                Manage returned items and stock reversals.
                            </p>
                        </div>

                        <Link
                            href={route('sale-returns.create')}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                        >
                            Create Return
                        </Link>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="flex flex-col gap-3 md:flex-row">
                            <input
                                type="text"
                                placeholder="Search return no or invoice no"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 md:w-96"
                            />

                            <button
                                type="button"
                                onClick={apply}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                            >
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={reset}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Return No</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Invoice</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Amount</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                                    {returns.data.length > 0 ? (
                                        returns.data.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3">{item.return_no}</td>
                                                <td className="px-4 py-3">{item.sale?.invoice_no ?? '-'}</td>
                                                <td className="px-4 py-3">{item.return_date}</td>
                                                <td className="px-4 py-3">{item.customer?.name ?? 'Walk-in'}</td>
                                                <td className="px-4 py-3">{item.branch?.name ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">{formatCurrency(item.total_amount)}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={route('sale-returns.show', item.id)}
                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                                                No sale returns found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {returns.links && (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {returns.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            link.active ? 'bg-slate-900 text-white' : 'bg-white text-gray-700'
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
