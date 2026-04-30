import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function ProfitByProduct({
    auth,
    rows,
    summary,
    filters,
    branches,
    categories,
    brands,
}) {
    const { data, setData, get } = useForm({
        from_date: filters?.from_date || '',
        to_date: filters?.to_date || '',
        branch_id: filters?.branch_id || '',
        category_id: filters?.category_id || '',
        brand_id: filters?.brand_id || '',
        search: filters?.search || '',
    });

    const submit = (e) => {
        e.preventDefault();

        get(route('reports.profit-by-product.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        router.get(route('reports.profit-by-product.index'));
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

    const margin = (profit, sales) => {
        if (!Number(sales)) return '0.00%';

        return `${((Number(profit) / Number(sales)) * 100).toFixed(2)}%`;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profit by Product Report" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Profit by Product Report
                        </h1>
                        <p className="text-sm text-gray-500">
                            Product-wise sales, cost, gross profit, and margin.
                        </p>
                    </div>

                    {auth.permissions.includes('reports.profit_by_product.export') && (
                        <a
                            href={route('reports.profit-by-product.export', data)}
                            className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
                        >
                            Export Excel
                        </a>
                    )}
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                    <SummaryCard title="Sold Quantity" value={number(summary.total_qty)} />
                    <SummaryCard title="Sales Amount" value={`Rs. ${money(summary.sales_amount)}`} />
                    <SummaryCard title="Cost Amount" value={`Rs. ${money(summary.cost_amount)}`} />
                    <SummaryCard title="Gross Profit" value={`Rs. ${money(summary.gross_profit)}`} />
                </div>

                <div className="mb-6 rounded bg-white p-4 shadow">
                    <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-7">
                        <Input label="From" type="date" value={data.from_date} onChange={(value) => setData('from_date', value)} />
                        <Input label="To" type="date" value={data.to_date} onChange={(value) => setData('to_date', value)} />
                        <Input label="Search" type="text" value={data.search} onChange={(value) => setData('search', value)} placeholder="Product or SKU" />

                        <Select label="Branch" value={data.branch_id} onChange={(value) => setData('branch_id', value)}>
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </Select>

                        <Select label="Category" value={data.category_id} onChange={(value) => setData('category_id', value)}>
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>

                        <Select label="Brand" value={data.brand_id} onChange={(value) => setData('brand_id', value)}>
                            <option value="">All Brands</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </Select>

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
                                <TableHead>Sold Qty</TableHead>
                                <TableHead>Sales Amount</TableHead>
                                <TableHead>Cost Amount</TableHead>
                                <TableHead>Gross Profit</TableHead>
                                <TableHead>Margin</TableHead>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 bg-white">
                            {rows.data.length > 0 ? (
                                rows.data.map((row) => (
                                    <tr key={row.product_id}>
                                        <TableCell>{row.product_name}</TableCell>
                                        <TableCell>{row.sku || '-'}</TableCell>
                                        <TableCell>{row.category_name || '-'}</TableCell>
                                        <TableCell>{row.brand_name || '-'}</TableCell>
                                        <TableCell>{number(row.total_qty)}</TableCell>
                                        <TableCell>Rs. {money(row.sales_amount)}</TableCell>
                                        <TableCell>Rs. {money(row.cost_amount)}</TableCell>
                                        <TableCell>Rs. {money(row.gross_profit)}</TableCell>
                                        <TableCell>{margin(row.gross_profit, row.sales_amount)}</TableCell>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                        No profit records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                    {rows.links.map((link, index) => (
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

function Input({ label, type, value, onChange, placeholder = '' }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full rounded border-gray-300"
            />
        </div>
    );
}

function Select({ label, value, onChange, children }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded border-gray-300"
            >
                {children}
            </select>
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
