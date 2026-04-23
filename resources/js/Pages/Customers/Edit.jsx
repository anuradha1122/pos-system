import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerForm from '@/Components/Customers/CustomerForm';
import { Head, usePage } from '@inertiajs/react';

export default function Edit({ customer }) {
    const { auth } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Edit Customer</h2>}
        >
            <Head title="Edit Customer" />

            <div className="py-6">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="rounded-xl bg-white p-6 shadow">
                        <CustomerForm customer={customer} submitLabel="Update Customer" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
