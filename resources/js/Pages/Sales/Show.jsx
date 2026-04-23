import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ sale }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Sale Receipt</h2>}
        >
            <Head title={sale.invoice_no} />

            <div className="py-6 print:py-0">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8 print:max-w-full print:px-0">
                    <div className="flex items-center justify-between print:hidden">
                        <Link
                            href={route('sales.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            Back to Sales
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Print Receipt
                        </button>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:rounded-none print:shadow-none">
                        <div className="mb-8 flex items-start justify-between border-b pb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Sales Receipt</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Invoice: {sale.invoice_no}
                                </p>
                            </div>

                            <div className="text-right text-sm">
                                <div className="text-gray-500">Date</div>
                                <div className="font-medium text-slate-900">{sale.sale_date}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Branch Details
                                </div>
                                <div className="font-medium text-slate-900">
                                    {sale.branch?.name ?? '-'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Cashier
                                </div>
                                <div className="font-medium text-slate-900">
                                    {sale.creator?.name ?? '-'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Customer Details
                                </div>
                                <div className="font-medium text-slate-900">
                                    {sale.customer?.name ?? 'Walk-in Customer'}
                                </div>
                                {sale.customer?.phone && (
                                    <div className="text-sm text-gray-600">{sale.customer.phone}</div>
                                )}
                                {sale.customer?.email && (
                                    <div className="text-sm text-gray-600">{sale.customer.email}</div>
                                )}
                                {sale.customer?.address && (
                                    <div className="mt-1 text-sm text-gray-600">
                                        {sale.customer.address}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Notes
                                </div>
                                <div className="text-sm text-slate-900">
                                    {sale.notes ? sale.notes : 'No notes'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            SKU
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Unit Price
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Line Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {sale.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">{item.product_name}</td>
                                            <td className="px-4 py-3">{item.sku ?? '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                {Number(item.quantity).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {Number(item.unit_price).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {Number(item.line_total).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <div className="w-full max-w-sm space-y-3 rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">
                                        {Number(sale.subtotal).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium">
                                        {Number(sale.discount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">
                                        {Number(sale.tax).toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                                        <span>Grand Total</span>
                                        <span>{Number(sale.grand_total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 text-center text-xs text-gray-500">
                            Generated from POS System
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
