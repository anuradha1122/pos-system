import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth, stats }) {
    console.log({ auth, stats });
    const cards = [
        { label: 'Branches', value: stats?.branches ?? 0 },
        { label: 'Users', value: stats?.users ?? 0 },
        { label: 'Roles', value: stats?.roles ?? 0 },
    ];

    return (
            // <AuthenticatedLayout
            //     user={auth.user}
            //     header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
            // >
            <div>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {cards.map((card) => (
                            <div key={card.label} className="rounded-xl bg-white p-6 shadow">
                                <div className="text-sm text-gray-500">{card.label}</div>
                                <div className="mt-2 text-3xl font-bold text-gray-900">
                                    {card.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </div>
        // </AuthenticatedLayout>
    );
}
