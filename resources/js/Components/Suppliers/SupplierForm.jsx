import { Link } from '@inertiajs/react';

export default function SupplierForm({
    data,
    setData,
    errors,
    processing,
    submit,
    isEdit = false,
}) {
    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <label className="mb-1 block text-sm font-medium text-gray-700">Company Name</label>
                <input
                    type="text"
                    value={data.company_name}
                    onChange={(e) => setData('company_name', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.company_name && <div className="mt-1 text-sm text-red-600">{errors.company_name}</div>}
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

            <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
                <textarea
                    rows="4"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
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

            <div className="md:col-span-2 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {isEdit ? 'Update Supplier' : 'Save Supplier'}
                </button>

                <Link
                    href={route('suppliers.index')}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
