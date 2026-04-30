import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function InventoryValuation({
    auth,
    stocks,
    summary,
    filters,
    branches,
    categories,
    brands,
}) {
    const { data, setData, get } = useForm({
        branch_id: filters?.branch_id || '',
        category_id: filters?.category_id || '',
        brand_id: filters?.brand_id || '',
        search: filters?.search || '',
    });

    const submit = (e) => {
        e.preventDefault();

        get(route('reports.inventory-valuation.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        router.get(route('reports.inventory-valuation.index'));
    };

    const money = (value) => {
        return Number(value || 0).toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const number = (value) => {
        return Number(value || 0).toLocaleString('en-LK');
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Inventory Valuation Report" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Inventory Valuation Report
                        </h1>
                        <p className="text-sm text-gray-500">
                            Current stock value based on branch stock and product cost price.
                        </p>
                    </div>

                    {auth.permissions.includes('reports.inventory_valuation.export') && (
                        <a
                            href={route('reports.inventory-valuation.export', data)}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
                        >
                            Export Excel
                        </a>
                    )}
                </div>


                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <SummaryCard
                        title="Total Stock Quantity"
                        value={number(summary.total_quantity)}
                    />

                    <SummaryCard
                        title="Total Inventory Value"
                        value={`Rs. ${money(summary.total_inventory_value)}`}
                    />

                    <SummaryCard
                        title="Low Stock Items"
                        value={number(summary.low_stock_count)}
                    />
                </div>

                <div className="mb-6 rounded bg-white p-4 shadow">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Search
                            </label>
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                placeholder="Product name or SKU"
                                className="w-full rounded border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Branch
                            </label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Category
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium">
                                Brand
                            </label>
                            <select
                                value={data.brand_id}
                                onChange={(e) => setData('brand_id', e.target.value)}
                                className="w-full rounded border-gray-300"
                            >
                                <option value="">All Brands</option>
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                type="submit"
                                className="rounded bg-slate-900 px-4 py-2 text-white"
                            >
                                Filter
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded bg-gray-200 px-4 py-2 text-gray-700"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHead>Product</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Reorder Level</TableHead>
                                <TableHead>Cost Price</TableHead>
                                <TableHead>Stock Value</TableHead>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {stocks.data.length > 0 ? (
                                stocks.data.map((stock) => {
                                    const costPrice = stock.product?.cost_price || 0;
                                    const stockValue = Number(stock.quantity || 0) * Number(costPrice);

                                    return (
                                        <tr key={stock.id}>
                                            <TableCell>
                                                {stock.product?.name || '-'}
                                            </TableCell>

                                            <TableCell>
                                                {stock.product?.sku || '-'}
                                            </TableCell>

                                            <TableCell>
                                                {stock.product?.category?.name || '-'}
                                            </TableCell>

                                            <TableCell>
                                                {stock.product?.brand?.name || '-'}
                                            </TableCell>

                                            <TableCell>
                                                {stock.branch?.name || '-'}
                                            </TableCell>

                                            <TableCell>
                                                {number(stock.quantity)}
                                            </TableCell>

                                            <TableCell>
                                                {number(stock.reorder_level)}
                                            </TableCell>

                                            <TableCell>
                                                Rs. {money(costPrice)}
                                            </TableCell>

                                            <TableCell>
                                                Rs. {money(stockValue)}
                                            </TableCell>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No stock records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {stocks.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            preserveScroll
                            className={`rounded px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-gray-200 text-gray-700'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ title, value }) {
    return (
        <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-medium text-gray-500">{title}</div>
            <div className="mt-2 text-xl font-bold text-gray-900">{value}</div>
        </div>
    );
}

function TableHead({ children }) {
    return (
        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
            {children}
        </th>
    );
}

function TableCell({ children }) {
    return (
        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
            {children}
        </td>
    );
}
