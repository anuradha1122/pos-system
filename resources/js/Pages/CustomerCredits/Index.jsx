import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ customers }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Customer Credits</h2>}
        >
            <Head title="Customer Credits" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <h1 className="mb-6 text-2xl font-bold">Customer Credit Report</h1>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Customer
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                            Phone
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Credit Sales
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Paid
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Outstanding
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {customers.data.length > 0 ? (
                                        customers.data.map((customer) => (
                                            <tr key={customer.id}>
                                                <td className="px-4 py-3">{customer.name}</td>
                                                <td className="px-4 py-3">{customer.phone ?? '-'}</td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(customer.total_credit_sales ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {Number(customer.total_paid ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-semibold text-red-600">
                                                    {Number(customer.outstanding_balance ?? 0).toFixed(2)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={route('customer-credits.show', customer.id)}
                                                        className="text-sm font-medium text-blue-600 hover:underline"
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-4 py-6 text-center text-sm text-gray-500"
                                            >
                                                No customer credits found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {customers.links && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {customers.links.map((link, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.visit(link.url)}
                                        className={`rounded border px-3 py-1 text-sm ${
                                            link.active
                                                ? 'bg-slate-900 text-white'
                                                : 'bg-white text-gray-700'
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
