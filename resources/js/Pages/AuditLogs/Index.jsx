import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, logs, filters, modules, actions }) {
    const [search, setSearch] = useState(filters.search || '');
    const [module, setModule] = useState(filters.module || '');
    const [action, setAction] = useState(filters.action || '');

    const applyFilters = () => {
        router.get(route('audit-logs.index'), {
            search,
            module,
            action,
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        router.get(route('audit-logs.index'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Audit Logs" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="text-sm text-gray-500">
                        Track user activities across important system records.
                    </p>
                </div>

                <div className="mb-6 rounded bg-white p-4 shadow">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <input
                            type="text"
                            placeholder="Search user, module, action..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="rounded border-gray-300"
                        />

                        <select
                            value={module}
                            onChange={(e) => setModule(e.target.value)}
                            className="rounded border-gray-300"
                        >
                            <option value="">All Modules</option>
                            {modules.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>

                        <select
                            value={action}
                            onChange={(e) => setAction(e.target.value)}
                            className="rounded border-gray-300"
                        >
                            <option value="">All Actions</option>
                            {actions.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                            <button
                                onClick={applyFilters}
                                className="rounded bg-slate-900 px-4 py-2 text-white"
                            >
                                Filter
                            </button>

                            <button
                                onClick={clearFilters}
                                className="rounded bg-gray-200 px-4 py-2"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">User</th>
                                <th className="p-3">Branch</th>
                                <th className="p-3">Module</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Record</th>
                                <th className="p-3 text-right">View</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.data.length > 0 ? (
                                logs.data.map((log) => (
                                    <tr key={log.id} className="border-t">
                                        <td className="p-3">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="p-3">{log.user?.name || '-'}</td>
                                        <td className="p-3">{log.branch?.name || '-'}</td>
                                        <td className="p-3 capitalize">{log.module}</td>
                                        <td className="p-3">
                                            <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            #{log.auditable_id || '-'}
                                        </td>
                                        <td className="p-3 text-right">
                                            <Link
                                                href={route('audit-logs.show', log.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        No audit logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex gap-2">
                    {logs.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-white text-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
