import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from '@/Components/Products/ProductForm';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ auth, product, categories, brands, units }) {
    const { flash } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        unit_id: product.unit_id || '',
        name: product.name || '',
        sku: product.sku || '',
        barcode: product.barcode || '',
        description: product.description || '',
        cost_price: product.cost_price || '',
        selling_price: product.selling_price || '',
        reorder_level: product.reorder_level || '0',
        is_active: !!product.is_active,
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold">Edit Product</h2>}
        >
            <Head title="Edit Product" />

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
                        isEdit
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
