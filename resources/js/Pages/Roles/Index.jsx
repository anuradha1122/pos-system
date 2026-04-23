import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ roles }) {
    const { auth, flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Roles</h2>}
        >
            <Head title="Roles" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {flash?.success && (
                        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-gray-900">Role List</h3>

                            {auth.permissions?.includes('role.create') && (
                                <Link
                                    href={route('roles.create')}
                                    className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Create Role
                                </Link>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Permissions</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {roles.length > 0 ? (
                                        roles.map((role) => (
                                            <tr key={role.id}>
                                                <td className="px-4 py-4 text-sm text-gray-900">{role.name}</td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{role.permissions_count}</td>
                                                <td className="px-4 py-4 text-sm">
                                                    {auth.permissions?.includes('role.edit') && (
                                                        <Link
                                                            href={route('roles.edit', role.id)}
                                                            className="text-indigo-600 hover:text-indigo-800"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-500">
                                                No roles found.
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
