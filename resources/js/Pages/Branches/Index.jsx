import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ branches }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Branches</h2>}
        >
            <Head title="Branches" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Branch List</h3>

                            <Link
                                href={route('branches.create')}
                                className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
                            >
                                Create Branch
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-4 py-3 text-left">Name</th>
                                        <th className="px-4 py-3 text-left">Code</th>
                                        <th className="px-4 py-3 text-left">Phone</th>
                                        <th className="px-4 py-3 text-left">Email</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {branches.data.length > 0 ? (
                                        branches.data.map((branch) => (
                                            <tr key={branch.id} className="border-b">
                                                <td className="px-4 py-3">{branch.name}</td>
                                                <td className="px-4 py-3">{branch.code}</td>
                                                <td className="px-4 py-3">{branch.phone ?? '-'}</td>
                                                <td className="px-4 py-3">{branch.email ?? '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`rounded-full px-2 py-1 text-xs ${
                                                        branch.is_active
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {branch.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={route('branches.edit', branch.id)}
                                                        className="text-sm text-blue-600 underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                                                No branches found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {branches.links.map((link, index) => (
                                <span key={index}>
                                    {link.url ? (
                                        <Link
                                            href={link.url}
                                            className={`rounded border px-3 py-1 text-sm ${
                                                link.active ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            className="rounded border px-3 py-1 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
