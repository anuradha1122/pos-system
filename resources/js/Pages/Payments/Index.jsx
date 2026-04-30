import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, payments }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Payments" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Payments</h1>

                    <Link
                        href={route('payments.create')}
                        className="rounded bg-slate-900 px-4 py-2 text-white"
                    >
                        Add Payment
                    </Link>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Reference</th>
                                <th className="p-3">Branch</th>
                                <th className="p-3">Type</th>
                                <th className="p-3">Method</th>
                                <th className="p-3 text-right">Amount</th>
                                <th className="p-3">Created By</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.data.map((payment) => (
                                <tr key={payment.id} className="border-t">
                                    <td className="p-3">
                                        {new Date(payment.created_at).toLocaleDateString()}
                                    </td>

                                    <td className="p-3">
                                        {payment.reference_type
                                            ? `${payment.reference_type} #${payment.reference_id}`
                                            : '-'}
                                    </td>

                                    <td className="p-3">
                                        {payment.branch?.name || '-'}
                                    </td>

                                    <td className="p-3">
                                        <span
                                            className={`rounded px-2 py-1 text-xs ${
                                                payment.type === 'in'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {payment.type?.toUpperCase()}
                                        </span>
                                    </td>

                                    <td className="p-3 capitalize">
                                        {payment.method || '-'}
                                    </td>

                                    <td className="p-3 text-right">
                                        Rs. {Number(payment.amount).toFixed(2)}
                                    </td>

                                    <td className="p-3">
                                        {payment.creator?.name || '-'}
                                    </td>

                                    <td className="p-3">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={route('payments.receipt', payment.id)}
                                                className="rounded bg-slate-700 px-3 py-1 text-xs text-white"
                                            >
                                                Receipt
                                            </Link>

                                            <a
                                                href={route('payments.receipt.pdf', payment.id)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded bg-red-600 px-3 py-1 text-xs text-white"
                                            >
                                                PDF
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {payments.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No payments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
