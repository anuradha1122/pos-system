import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from '@/Components/Suppliers/SupplierForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        company_name: '',
        phone: '',
        email: '',
        address: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Create Supplier</h2>}
        >
            <Head title="Create Supplier" />

            <div className="p-6">
                <div className="rounded-xl bg-white p-6 shadow">
                    <SupplierForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
