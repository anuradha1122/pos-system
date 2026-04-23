import { Link } from '@inertiajs/react';

export default function ProductForm({
    data,
    setData,
    errors,
    processing,
    submit,
    categories,
    brands,
    units,
    isEdit = false,
}) {
    return (
        <form onSubmit={submit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                <select
                    value={data.category_id}
                    onChange={(e) => setData('category_id', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Select category</option>
                    {categories.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                {errors.category_id && <div className="mt-1 text-sm text-red-600">{errors.category_id}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Brand</label>
                <select
                    value={data.brand_id}
                    onChange={(e) => setData('brand_id', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Select brand</option>
                    {brands.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                {errors.brand_id && <div className="mt-1 text-sm text-red-600">{errors.brand_id}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Unit</label>
                <select
                    value={data.unit_id}
                    onChange={(e) => setData('unit_id', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                    <option value="">Select unit</option>
                    {units.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                {errors.unit_id && <div className="mt-1 text-sm text-red-600">{errors.unit_id}</div>}
            </div>

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
                <label className="mb-1 block text-sm font-medium text-gray-700">SKU</label>
                <input
                    type="text"
                    value={data.sku}
                    onChange={(e) => setData('sku', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.sku && <div className="mt-1 text-sm text-red-600">{errors.sku}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Barcode</label>
                <input
                    type="text"
                    value={data.barcode}
                    onChange={(e) => setData('barcode', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.barcode && <div className="mt-1 text-sm text-red-600">{errors.barcode}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Cost Price</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.cost_price}
                    onChange={(e) => setData('cost_price', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.cost_price && <div className="mt-1 text-sm text-red-600">{errors.cost_price}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Selling Price</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.selling_price}
                    onChange={(e) => setData('selling_price', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.selling_price && <div className="mt-1 text-sm text-red-600">{errors.selling_price}</div>}
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Reorder Level</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={data.reorder_level}
                    onChange={(e) => setData('reorder_level', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.reorder_level && <div className="mt-1 text-sm text-red-600">{errors.reorder_level}</div>}
            </div>

            <div className="flex items-center gap-2 pt-8">
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

            <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows="4"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                />
                {errors.description && <div className="mt-1 text-sm text-red-600">{errors.description}</div>}
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 disabled:opacity-50"
                >
                    {isEdit ? 'Update Product' : 'Save Product'}
                </button>

                <Link
                    href={route('products.index')}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
