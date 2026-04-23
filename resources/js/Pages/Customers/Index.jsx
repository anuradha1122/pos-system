import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ customers, filters }) {
    const { auth } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get(route('customers.index'), { search, status }, { preserveState: true, replace: true });
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        router.get(route('customers.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Customers</h2>}
        >
            <Head title="Customers" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                        placeholder="Name, phone, email"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="">All</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        onClick={applyFilters}
                                        className="rounded-lg bg-slate-900 px-4 py-2 text-white"
                                    >
                                        Filter
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="rounded-lg border border-gray-300 px-4 py-2"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>

                            <Link
                                href={route('customers.create')}
                                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                            >
                                New Customer
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {customers.data.length > 0 ? (
                                        customers.data.map((customer) => (
                                            <tr key={customer.id}>
                                                <td className="px-4 py-3">{customer.name}</td>
                                                <td className="px-4 py-3">{customer.phone}</td>
                                                <td className="px-4 py-3">{customer.email ?? '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                                                            customer.is_active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {customer.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={route('customers.edit', customer.id)}
                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-500">
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
