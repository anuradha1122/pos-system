import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

function statusBadge(status) {
    const classes = {
        refunded: 'bg-green-100 text-green-700',
        partial: 'bg-yellow-100 text-yellow-700',
        credit: 'bg-blue-100 text-blue-700',
        none: 'bg-gray-100 text-gray-700',
    };

    return classes[status] ?? 'bg-gray-100 text-gray-700';
}

export default function Show({ auth, purchaseReturn }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Purchase Return #${purchaseReturn.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Purchase Return #{purchaseReturn.id}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="rounded bg-slate-900 px-4 py-2 text-white print:hidden"
                        >
                            Print
                        </button>

                        <Link
                            href={route('purchase-returns.index')}
                            className="rounded bg-gray-200 px-4 py-2 print:hidden"
                        >
                            Back
                        </Link>
                    </div>
                </div>

                <div className="mb-6 rounded bg-white p-6 shadow print:shadow-none">
                    <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                        <div>
                            <strong>Supplier:</strong> {purchaseReturn.supplier?.name}
                        </div>

                        <div>
                            <strong>Branch:</strong> {purchaseReturn.branch?.name}
                        </div>

                        <div>
                            <strong>Return Date:</strong> {purchaseReturn.return_date}
                        </div>

                        <div>
                            <strong>Total:</strong> Rs.{' '}
                            {Number(purchaseReturn.total_amount ?? 0).toFixed(2)}
                        </div>

                        <div>
                            <strong>Refund Amount:</strong> Rs.{' '}
                            {Number(purchaseReturn.refund_amount ?? 0).toFixed(2)}
                        </div>

                        <div>
                            <strong>Refund Method:</strong>{' '}
                            <span className="capitalize">
                                {purchaseReturn.refund_method ?? '-'}
                            </span>
                        </div>

                        <div>
                            <strong>Refund Status:</strong>{' '}
                            <span
                                className={`inline-flex rounded px-2 py-1 text-xs font-medium capitalize ${statusBadge(
                                    purchaseReturn.refund_status ?? 'none'
                                )}`}
                            >
                                {purchaseReturn.refund_status ?? 'none'}
                            </span>
                        </div>

                        <div className="md:col-span-3">
                            <strong>Reason:</strong> {purchaseReturn.reason ?? '-'}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow print:shadow-none">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Product</th>
                                <th className="p-3 text-right">Qty</th>
                                <th className="p-3 text-right">Cost Price</th>
                                <th className="p-3 text-right">Line Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {purchaseReturn.items.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">{item.product?.name}</td>
                                    <td className="p-3 text-right">{item.quantity}</td>
                                    <td className="p-3 text-right">
                                        Rs. {Number(item.cost_price ?? 0).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right">
                                        Rs. {Number(item.line_total ?? 0).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan="3" className="p-3 text-right font-bold">
                                    Total
                                </td>
                                <td className="p-3 text-right font-bold">
                                    Rs. {Number(purchaseReturn.total_amount ?? 0).toFixed(2)}
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="3" className="p-3 text-right font-bold">
                                    Refund Amount
                                </td>
                                <td className="p-3 text-right font-bold">
                                    Rs. {Number(purchaseReturn.refund_amount ?? 0).toFixed(2)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
