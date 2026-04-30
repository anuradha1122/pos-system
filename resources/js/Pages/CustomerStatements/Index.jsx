import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, customers, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const applyFilter = (e) => {
        e.preventDefault();

        router.get(
            route('customer-statements.index'),
            { search },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const resetFilter = () => {
        router.get(route('customer-statements.index'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Customer Statements" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Customer Statements</h1>
                    <p className="text-sm text-gray-500">
                        Search customers and view sales, payments, returns, and balances.
                    </p>
                </div>

                <form
                    onSubmit={applyFilter}
                    className="mb-6 rounded bg-white p-4 shadow"
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <label className="mb-1 block text-sm font-medium">
                                Search
                            </label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, phone, or email"
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
                            >
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={resetFilter}
                                className="rounded bg-gray-200 px-4 py-2 text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </form>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Customer</th>
                                <th className="p-3">Phone</th>
                                <th className="p-3">Email</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.data.map((customer) => (
                                <tr key={customer.id} className="border-t">
                                    <td className="p-3 font-medium">
                                        {customer.name}
                                    </td>
                                    <td className="p-3">{customer.phone || '-'}</td>
                                    <td className="p-3">{customer.email || '-'}</td>
                                    <td className="p-3 text-right">
                                        <Link
                                            href={route('customer-statements.show', customer.id)}
                                            className="rounded bg-slate-900 px-3 py-1 text-xs text-white"
                                        >
                                            View Statement
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {customers.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {customers.links && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {customers.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-white text-gray-700'
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
