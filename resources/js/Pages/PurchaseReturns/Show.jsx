import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, purchaseReturn }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Purchase Return #${purchaseReturn.id}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Purchase Return #{purchaseReturn.id}
                    </h1>

                    <Link
                        href={route('purchase-returns.index')}
                        className="rounded bg-gray-200 px-4 py-2"
                    >
                        Back
                    </Link>
                </div>

                <div className="mb-6 rounded bg-white p-6 shadow">
                    <div className="grid grid-cols-2 gap-4 text-sm">
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
                            {Number(purchaseReturn.total_amount).toFixed(2)}
                        </div>
                        <div className="col-span-2">
                            <strong>Reason:</strong> {purchaseReturn.reason ?? '-'}
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
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
                                        Rs. {Number(item.cost_price).toFixed(2)}
                                    </td>
                                    <td className="p-3 text-right">
                                        Rs. {Number(item.line_total).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
