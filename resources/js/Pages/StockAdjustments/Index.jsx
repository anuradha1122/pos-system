import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ auth, movements }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Stock Adjustments</h2>}
        >
            <Head title="Stock Adjustments" />

            <div className="space-y-6 p-6">
                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="flex justify-end">
                    <Link
                        href={route('stock-adjustments.create')}
                        className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
                    >
                        New Adjustment
                    </Link>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty In</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Qty Out</th>
                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Balance After</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {movements.data.length > 0 ? (
                                movements.data.map((movement) => (
                                    <tr key={movement.id}>
                                        <td className="px-4 py-3 text-sm text-gray-800">{movement.created_at}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{movement.branch?.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">
                                            {movement.product?.name} ({movement.product?.sku})
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{movement.type}</td>
                                        <td className="px-4 py-3 text-right text-sm text-green-700">{movement.qty_in}</td>
                                        <td className="px-4 py-3 text-right text-sm text-red-700">{movement.qty_out}</td>
                                        <td className="px-4 py-3 text-right text-sm text-gray-800">{movement.balance_after}</td>
                                        <td className="px-4 py-3 text-sm text-gray-800">{movement.creator?.name ?? '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-gray-500">
                                        No stock adjustments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap gap-2">
                    {movements.links.map((link, index) => (
                        <button
                            key={index}
                            type="button"
                            disabled={!link.url}
                            onClick={() => link.url && router.visit(link.url)}
                            className={`rounded border px-3 py-1 text-sm ${
                                link.active ? 'bg-slate-900 text-white' : 'bg-white text-gray-700'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
