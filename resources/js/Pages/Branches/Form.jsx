import { useForm } from '@inertiajs/react';

export default function BranchForm({ branch = null, onSubmitLabel = 'Save' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: branch?.name ?? '',
        code: branch?.code ?? '',
        phone: branch?.phone ?? '',
        email: branch?.email ?? '',
        address: branch?.address ?? '',
        is_active: branch?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (branch) {
            put(route('branches.update', branch.id));
        } else {
            post(route('branches.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Code</label>
                    <input
                        type="text"
                        value={data.code}
                        onChange={(e) => setData('code', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    {errors.code && <div className="mt-1 text-sm text-red-600">{errors.code}</div>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    {errors.phone && <div className="mt-1 text-sm text-red-600">{errors.phone}</div>}
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                    {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    rows={4}
                />
                {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
            </div>

            <div className="flex items-center gap-2">
                <input
                    id="is_active"
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active
                </label>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-gray-900 px-4 py-2 text-white"
                >
                    {processing ? 'Saving...' : onSubmitLabel}
                </button>
            </div>
        </form>
    );
}
