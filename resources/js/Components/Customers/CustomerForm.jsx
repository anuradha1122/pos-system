import { useForm } from '@inertiajs/react';

export default function CustomerForm({ customer = null, submitLabel = 'Save' }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: customer?.name ?? '',
        phone: customer?.phone ?? '',
        email: customer?.email ?? '',
        address: customer?.address ?? '',
        is_active: customer?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (customer) {
            put(route('customers.update', customer.id));
        } else {
            post(route('customers.store'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={data.is_active ? '1' : '0'}
                        onChange={(e) => setData('is_active', e.target.value === '1')}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                    >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                    </select>
                    {errors.is_active && <div className="mt-1 text-sm text-red-600">{errors.is_active}</div>}
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.address && <div className="mt-1 text-sm text-red-600">{errors.address}</div>}
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : submitLabel}
                </button>
            </div>
        </form>
    );
}
