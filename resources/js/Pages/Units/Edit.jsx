import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, unit }) {
    const { data, setData, put, processing, errors } = useForm({
        name: unit.name || '',
        short_name: unit.short_name || '',
        is_active: unit.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('units.update', unit.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Unit</h2>}
        >
            <Head title="Edit Unit" />

            <div className="py-6">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                                {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Short Name</label>
                                <input
                                    type="text"
                                    value={data.short_name}
                                    onChange={(e) => setData('short_name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                                />
                                {errors.short_name && (
                                    <div className="mt-1 text-sm text-red-600">{errors.short_name}</div>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={data.is_active ? '1' : '0'}
                                    onChange={(e) => setData('is_active', e.target.value === '1')}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                {errors.is_active && (
                                    <div className="mt-1 text-sm text-red-600">{errors.is_active}</div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                                >
                                    Update
                                </button>

                                <Link
                                    href={route('units.index')}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
