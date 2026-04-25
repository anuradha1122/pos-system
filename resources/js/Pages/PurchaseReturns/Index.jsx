import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, purchaseReturns }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Purchase Returns" />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Purchase Returns</h1>

                    <Link
                        href={route('purchase-returns.create')}
                        className="rounded bg-slate-900 px-4 py-2 text-white"
                    >
                        New Purchase Return
                    </Link>
                </div>

                <div className="overflow-hidden rounded bg-white shadow">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3">Date</th>
                                <th className="p-3">Supplier</th>
                                <th className="p-3">Branch</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseReturns.data.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="p-3">{item.return_date}</td>
                                    <td className="p-3">{item.supplier?.name}</td>
                                    <td className="p-3">{item.branch?.name}</td>
                                    <td className="p-3">
                                        Rs. {Number(item.total_amount).toFixed(2)}
                                    </td>
                                    <td className="p-3">
                                        <Link
                                            href={route('purchase-returns.show', item.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {purchaseReturns.data.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-6 text-center text-gray-500">
                                        No purchase returns found.
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
