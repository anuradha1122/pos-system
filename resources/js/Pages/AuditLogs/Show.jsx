import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, log }) {
    const JsonBox = ({ title, data }) => (
        <div className="rounded bg-white p-4 shadow">
            <h2 className="mb-3 font-semibold text-gray-800">{title}</h2>

            <pre className="max-h-[500px] overflow-auto rounded bg-gray-900 p-4 text-xs text-green-300">
                {JSON.stringify(data || {}, null, 2)}
            </pre>
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Audit Log #${log.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Audit Log #{log.id}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Detailed activity record.
                        </p>
                    </div>

                    <Link
                        href={route('audit-logs.index')}
                        className="rounded bg-gray-200 px-4 py-2"
                    >
                        Back
                    </Link>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">User</div>
                        <div className="font-semibold">{log.user?.name || '-'}</div>
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">Branch</div>
                        <div className="font-semibold">{log.branch?.name || '-'}</div>
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-semibold">
                            {new Date(log.created_at).toLocaleString()}
                        </div>
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">Module</div>
                        <div className="font-semibold capitalize">{log.module}</div>
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">Action</div>
                        <div className="font-semibold">{log.action}</div>
                    </div>

                    <div className="rounded bg-white p-4 shadow">
                        <div className="text-sm text-gray-500">Record ID</div>
                        <div className="font-semibold">#{log.auditable_id || '-'}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <JsonBox title="Old Values" data={log.old_values} />
                    <JsonBox title="New Values" data={log.new_values} />
                </div>

                <div className="mt-6 rounded bg-white p-4 shadow">
                    <h2 className="mb-3 font-semibold text-gray-800">Request Info</h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <div className="text-sm text-gray-500">IP Address</div>
                            <div>{log.ip_address || '-'}</div>
                        </div>

                        <div>
                            <div className="text-sm text-gray-500">User Agent</div>
                            <div className="break-all text-sm">{log.user_agent || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
