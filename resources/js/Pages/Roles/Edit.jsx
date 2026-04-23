import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Edit({ role, permissionGroups }) {
    const { auth, errors } = usePage().props;

    const { data, setData, put, processing } = useForm({
        name: role.name || '',
        permissions: role.permissions || [],
    });

    const togglePermission = (permissionName) => {
        if (data.permissions.includes(permissionName)) {
            setData(
                'permissions',
                data.permissions.filter((item) => item !== permissionName)
            );
        } else {
            setData('permissions', [...data.permissions, permissionName]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Role</h2>}
        >
            <Head title="Edit Role" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-2xl font-semibold text-gray-900">Edit Role</h3>

                            <Link
                                href={route('roles.index')}
                                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Back
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Role Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-medium text-gray-700">Permissions</label>

                                <div className="space-y-6">
                                    {permissionGroups.map((group) => (
                                        <div key={group.group} className="rounded-lg border border-gray-200 p-4">
                                            <h4 className="mb-3 text-lg font-semibold text-gray-800">{group.group}</h4>

                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                                {group.permissions.map((permission) => (
                                                    <label
                                                        key={permission.name}
                                                        className="flex items-center gap-3 rounded-md border border-gray-200 px-3 py-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(permission.name)}
                                                            onChange={() => togglePermission(permission.name)}
                                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{permission.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {errors.permissions && (
                                    <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>
                                )}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                                >
                                    {processing ? 'Updating...' : 'Update Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
