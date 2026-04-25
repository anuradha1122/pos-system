import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        maximumFractionDigits: 2,
    }).format(Number(amount || 0));
}

export default function Show({ saleReturn }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Sales Return Details</h2>}
        >
            <Head title={saleReturn.return_no} />

            <div className="py-6">
                <div className="mx-auto max-w-5xl space-y-6 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{saleReturn.return_no}</h3>
                            <p className="text-sm text-gray-500">Sales return receipt</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white print:hidden"
                            >
                                Print
                            </button>

                            <Link
                                href={route('sale-returns.index')}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 print:hidden"
                            >
                                Back
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:shadow-none">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <div className="text-sm text-gray-500">Original Invoice</div>
                                <div className="font-semibold">{saleReturn.sale?.invoice_no}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Return Date</div>
                                <div className="font-semibold">{saleReturn.return_date}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Branch</div>
                                <div className="font-semibold">{saleReturn.branch?.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Customer</div>
                                <div className="font-semibold">{saleReturn.customer?.name ?? 'Walk-in'}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Created By</div>
                                <div className="font-semibold">{saleReturn.creator?.name}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-500">Total Amount</div>
                                <div className="font-semibold">{formatCurrency(saleReturn.total_amount)}</div>
                            </div>
                        </div>

                        {saleReturn.reason && (
                            <div className="mt-4">
                                <div className="text-sm text-gray-500">Reason</div>
                                <div className="font-medium">{saleReturn.reason}</div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow print:shadow-none">
                        <h3 className="mb-4 text-lg font-semibold text-slate-900">Returned Items</h3>

                        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">SKU</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Unit Price</th>
                                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Line Total</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                                {saleReturn.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3">{item.product?.name}</td>
                                        <td className="px-4 py-3">{item.product?.sku}</td>
                                        <td className="px-4 py-3 text-right">{item.quantity}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.line_total)}</td>
                                    </tr>
                                ))}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td colSpan="4" className="px-4 py-3 text-right font-bold">Total</td>
                                    <td className="px-4 py-3 text-right font-bold">
                                        {formatCurrency(saleReturn.total_amount)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
