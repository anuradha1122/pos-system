import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, brands }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Brands</h2>}
        >
            <Head title="Brands" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="rounded-lg bg-green-100 px-4 py-3 text-green-800">
                            {flash.success}
                        </div>
                    )}

                    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Brand List</h3>
                            <p className="text-sm text-gray-500">Manage product brands</p>
                        </div>

                        <Link
                            href={route('brands.create')}
                            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Create Brand
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-xl bg-white shadow">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Code
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {brands.length > 0 ? (
                                        brands.map((brand) => (
                                            <tr key={brand.id}>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {brand.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {brand.code || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                            brand.is_active
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                    >
                                                        {brand.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm">
                                                    <Link
                                                        href={route('brands.edit', brand.id)}
                                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-10 text-center text-sm text-gray-500">
                                                No brands found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
