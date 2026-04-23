import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Show({ purchase }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Purchase Details</h2>}
        >
            <Head title={purchase.purchase_no} />

            <div className="py-6 print:py-0">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8 print:max-w-full print:px-0">
                    <div className="flex items-center justify-between print:hidden">
                        <Link
                            href={route('purchases.index')}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
                        >
                            Back to Purchases
                        </Link>

                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Print Purchase
                        </button>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:rounded-none print:shadow-none">
                        <div className="mb-8 flex items-start justify-between border-b pb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Purchase Receipt</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Purchase No: {purchase.purchase_no}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Supplier Invoice: {purchase.invoice_no ?? '-'}
                                </p>
                            </div>

                            <div className="text-right text-sm">
                                <div className="text-gray-500">Date</div>
                                <div className="font-medium text-slate-900">
                                    {purchase.purchase_date}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Branch Details
                                </div>
                                <div className="font-medium text-slate-900">
                                    {purchase.branch?.name ?? '-'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Created By
                                </div>
                                <div className="font-medium text-slate-900">
                                    {purchase.creator?.name ?? '-'}
                                </div>
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Supplier Details
                                </div>
                                <div className="font-medium text-slate-900">
                                    {purchase.supplier?.name ?? '-'}
                                </div>
                                {purchase.supplier?.phone && (
                                    <div className="text-sm text-gray-600">
                                        {purchase.supplier.phone}
                                    </div>
                                )}
                                {purchase.supplier?.email && (
                                    <div className="text-sm text-gray-600">
                                        {purchase.supplier.email}
                                    </div>
                                )}
                                {purchase.supplier?.address && (
                                    <div className="mt-1 text-sm text-gray-600">
                                        {purchase.supplier.address}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-200 p-4">
                                <div className="mb-2 text-sm font-semibold text-gray-500">
                                    Notes
                                </div>
                                <div className="text-sm text-slate-900">
                                    {purchase.notes ? purchase.notes : 'No notes'}
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
                                            Unit Cost
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Line Total
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {purchase.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">{item.product_name}</td>
                                            <td className="px-4 py-3">{item.sku ?? '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                {Number(item.quantity).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {Number(item.unit_cost).toFixed(2)}
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
                                        {Number(purchase.subtotal).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium">
                                        {Number(purchase.discount).toFixed(2)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">
                                        {Number(purchase.tax).toFixed(2)}
                                    </span>
                                </div>

                                <div className="border-t pt-3">
                                    <div className="flex items-center justify-between text-lg font-bold text-slate-900">
                                        <span>Grand Total</span>
                                        <span>{Number(purchase.grand_total).toFixed(2)}</span>
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
