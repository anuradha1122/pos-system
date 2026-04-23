import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, products, filters, categories }) {
    const { flash } = usePage().props;

    const updateFilters = (key, value) => {
        router.get(
            route('products.index'),
            {
                ...filters,
                [key]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const toggleStatus = (productId) => {
        router.patch(route('products.toggle-status', productId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Products</h2>}
        >
            <Head title="Products" />

            <div className="space-y-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow md:flex-row md:items-end md:justify-between">
                    <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Search</label>
                            <input
                                type="text"
                                value={filters.search || ''}
                                onChange={(e) => updateFilters('search', e.target.value)}
                                placeholder="Name, SKU, barcode"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-slate-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={filters.status || ''}
                                onChange={(e) => updateFilters('status', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                            <select
                                value={filters.category_id || ''}
                                onChange={(e) => updateFilters('category_id', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <Link
                            href={route('products.create')}
                            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                        >
                            New Product
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Brand</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Unit</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Cost</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Selling</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Reorder</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {products.data.length > 0 ? (
                                products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{product.sku}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{product.category?.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{product.brand?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{product.unit?.name}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{product.cost_price}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{product.selling_price}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{product.reorder_level}</td>
                                        <td className="px-4 py-3 text-center text-sm">
                                            <span
                                                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                                    product.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-sm">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={route('products.edit', product.id)}
                                                    className="text-slate-700 hover:text-slate-900"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => toggleStatus(product.id)}
                                                    className="text-amber-600 hover:text-amber-700"
                                                >
                                                    {product.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {products.links.map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active ? 'bg-slate-900 text-white' : 'bg-white text-gray-700'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
