import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from '@/Components/Products/ProductForm';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Create({ auth, categories, brands, units }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        brand_id: '',
        unit_id: '',
        name: '',
        sku: '',
        barcode: '',
        description: '',
        cost_price: '',
        selling_price: '',
        reorder_level: '0',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('products.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Create Product</h2>}
        >
            <Head title="Create Product" />

            <div className="p-6">
                {flash?.success && (
                    <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                        {flash.success}
                    </div>
                )}

                <div className="rounded-xl bg-white p-6 shadow">
                    <ProductForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        submit={submit}
                        categories={categories}
                        brands={brands}
                        units={units}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
