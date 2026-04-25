import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth, branches, referenceTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        reference_type: '',
        reference_id: '',
        branch_id: '',
        type: 'in',
        amount: '',
        method: 'cash',
        note: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Add Payment" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">Add Payment</h1>

                <form onSubmit={submit} className="max-w-2xl space-y-5 rounded bg-white p-6 shadow">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Reference Type</label>
                        <select
                            value={data.reference_type}
                            onChange={(e) => setData('reference_type', e.target.value)}
                            className="w-full rounded border-gray-300"
                        >
                            <option value="">Select Reference</option>
                            {Object.entries(referenceTypes).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                        {errors.reference_type && (
                            <div className="mt-1 text-sm text-red-600">{errors.reference_type}</div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Reference ID</label>
                        <input
                            type="number"
                            value={data.reference_id}
                            onChange={(e) => setData('reference_id', e.target.value)}
                            className="w-full rounded border-gray-300"
                            placeholder="Example: Sale ID / Purchase ID"
                        />
                        {errors.reference_id && (
                            <div className="mt-1 text-sm text-red-600">{errors.reference_id}</div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Branch</label>
                        <select
                            value={data.branch_id}
                            onChange={(e) => setData('branch_id', e.target.value)}
                            className="w-full rounded border-gray-300"
                        >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branch_id && (
                            <div className="mt-1 text-sm text-red-600">{errors.branch_id}</div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Payment Type</label>
                        <select
                            value={data.type}
                            onChange={(e) => setData('type', e.target.value)}
                            className="w-full rounded border-gray-300"
                        >
                            <option value="in">IN - Money Received</option>
                            <option value="out">OUT - Money Paid</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Method</label>
                        <select
                            value={data.method}
                            onChange={(e) => setData('method', e.target.value)}
                            className="w-full rounded border-gray-300"
                        >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank">Bank</option>
                            <option value="credit">Credit</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full rounded border-gray-300"
                        />
                        {errors.amount && (
                            <div className="mt-1 text-sm text-red-600">{errors.amount}</div>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Note</label>
                        <textarea
                            value={data.note}
                            onChange={(e) => setData('note', e.target.value)}
                            className="w-full rounded border-gray-300"
                            rows="3"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
                    >
                        Save Payment
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
