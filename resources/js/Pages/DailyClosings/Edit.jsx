import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, closing }) {
    const { data, setData, put, processing, errors } = useForm({
        closing_date: closing.closing_date,
        opening_balance: closing.opening_balance,
        counted_cash: closing.counted_cash,
        note: closing.note || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('daily-closings.update', closing.id));
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Edit Closing" />

            <div className="p-6 max-w-xl">
                <form onSubmit={submit} className="space-y-4 bg-white p-6 shadow rounded">

                    <input type="date"
                        value={data.closing_date}
                        onChange={e => setData('closing_date', e.target.value)}
                        className="w-full border p-2 rounded"
                    />

                    <input type="number"
                        value={data.opening_balance}
                        onChange={e => setData('opening_balance', e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Opening Balance"
                    />

                    <input type="number"
                        value={data.counted_cash}
                        onChange={e => setData('counted_cash', e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Counted Cash"
                    />

                    <textarea
                        value={data.note}
                        onChange={e => setData('note', e.target.value)}
                        className="w-full border p-2 rounded"
                        placeholder="Note"
                    />

                    <div className="flex gap-2">
                        <button className="bg-slate-900 text-white px-4 py-2 rounded">
                            Update
                        </button>

                        <Link href={route('daily-closings.index')}>
                            Cancel
                        </Link>
                    </div>

                </form>
            </div>
        </AuthenticatedLayout>
    );
}
