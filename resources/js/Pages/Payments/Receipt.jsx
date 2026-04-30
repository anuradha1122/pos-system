import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Receipt({ auth, payment, company, receiptNo }) {
    const partyName =
        payment.customer?.name ||
        payment.supplier?.name ||
        'Walk-in / General';

    const partyPhone =
        payment.customer?.phone ||
        payment.supplier?.phone ||
        '-';

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Payment Receipt ${receiptNo}`} />

            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">
                        Payment Receipt
                    </h1>

                    <div className="flex gap-2">
                        <Link
                            href={route('payments.index')}
                            className="rounded bg-gray-200 px-4 py-2 text-sm"
                        >
                            Back
                        </Link>

                        <a
                            href={route('payments.receipt.pdf', payment.id)}
                            target="_blank"
                            className="rounded bg-red-600 px-4 py-2 text-sm text-white"
                        >
                            PDF
                        </a>

                        <button
                            onClick={() => window.print()}
                            className="rounded bg-slate-900 px-4 py-2 text-sm text-white"
                        >
                            Print
                        </button>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl rounded bg-white p-8 shadow print:shadow-none">
                    <div className="mb-6 text-center">
                        {company?.logo && (
                            <img
                                src={`/storage/${company.logo}`}
                                alt="Logo"
                                className="mx-auto mb-3 h-20 object-contain"
                            />
                        )}

                        <h2 className="text-2xl font-bold">
                            {company?.company_name || 'Company Name'}
                        </h2>

                        <p className="text-sm text-gray-600">
                            {company?.address || '-'}
                        </p>

                        <p className="text-sm text-gray-600">
                            {company?.phone || '-'} | {company?.email || '-'}
                        </p>
                    </div>

                    <hr className="my-4" />

                    <div className="mb-6 text-center">
                        <h3 className="text-xl font-bold uppercase">
                            Payment Receipt
                        </h3>
                        <p className="text-sm text-gray-600">
                            Receipt No: {receiptNo}
                        </p>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold">Payment Date</p>
                            <p>{payment.payment_date}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Branch</p>
                            <p>{payment.branch?.name || '-'}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Party</p>
                            <p>{partyName}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Phone</p>
                            <p>{partyPhone}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Payment Type</p>
                            <p className="capitalize">
                                {payment.payment_type?.replaceAll('_', ' ')}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Method</p>
                            <p className="capitalize">
                                {payment.payment_method?.replaceAll('_', ' ')}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">Reference No</p>
                            <p>{payment.reference_no || '-'}</p>
                        </div>

                        <div>
                            <p className="font-semibold">Created By</p>
                            <p>{payment.creator?.name || '-'}</p>
                        </div>
                    </div>

                    <div className="my-6 rounded border p-4 text-center">
                        <p className="text-sm font-semibold text-gray-600">
                            Amount
                        </p>
                        <p className="text-3xl font-bold">
                            Rs. {Number(payment.amount).toLocaleString()}
                        </p>
                    </div>

                    {payment.note && (
                        <div className="mb-6 text-sm">
                            <p className="font-semibold">Note</p>
                            <p>{payment.note}</p>
                        </div>
                    )}

                    <div className="mt-10 grid grid-cols-2 gap-8 text-center text-sm">
                        <div>
                            <div className="border-t pt-2">
                                Received By
                            </div>
                        </div>

                        <div>
                            <div className="border-t pt-2">
                                Customer / Supplier Signature
                            </div>
                        </div>
                    </div>

                    {company?.receipt_footer && (
                        <p className="mt-8 text-center text-xs text-gray-500">
                            {company.receipt_footer}
                        </p>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
