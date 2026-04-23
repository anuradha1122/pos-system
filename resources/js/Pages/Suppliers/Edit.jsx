import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from '@/Components/Suppliers/SupplierForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ auth, supplier }) {
    const { data, setData, put, processing, errors } = useForm({
        name: supplier.name || '',
        company_name: supplier.company_name || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        is_active: !!supplier.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('suppliers.update', supplier.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Edit Supplier</h2>}
        >
            <Head title="Edit Supplier" />

            <div className="p-6">
                <div className="rounded-xl bg-white p-6 shadow">
                    <SupplierForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        isEdit
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
