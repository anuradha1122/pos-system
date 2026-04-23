import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, suppliers, filters }) {
    const { flash } = usePage().props;

    const updateFilters = (key, value) => {
        router.get(
            route('suppliers.index'),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const toggleStatus = (supplierId) => {
        router.patch(route('suppliers.toggle-status', supplierId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Suppliers</h2>}
        >
            <Head title="Suppliers" />

            <div className="space-y-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-end md:justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                value={filters.search || ''}
                                onChange={(e) => updateFilters('search', e.target.value)}
                                placeholder="Name, company, phone, email"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => updateFilters('status', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <Link
                            href={route('suppliers.create')}
                            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                        >
                            New Supplier
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {suppliers.data.length > 0 ? (
                                suppliers.data.map((supplier) => (
                                    <tr key={supplier.id}>
                                        <td className="px-4 py-3 text-sm text-gray-800">{supplier.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{supplier.company_name ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{supplier.phone}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{supplier.email ?? '-'}</td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                    supplier.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {supplier.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={route('suppliers.edit', supplier.id)}
                                                    className="text-slate-700 hover:text-slate-900"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(supplier.id)}
                                                    className="text-amber-600 hover:text-amber-700"
                                                >
                                                    {supplier.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No suppliers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {suppliers.links.map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active ? 'bg-slate-900 text-white' : 'bg-white text-gray-700'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
