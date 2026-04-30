import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ setting }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',

        company_name: setting.company_name || '',
        address: setting.address || '',
        phone: setting.phone || '',
        email: setting.email || '',
        receipt_footer: setting.receipt_footer || '',
        logo: null,

        invoice_prefix: setting.invoice_prefix || 'INV',
        purchase_prefix: setting.purchase_prefix || 'PUR',
        receipt_width: setting.receipt_width || '80mm',
        low_stock_threshold: setting.low_stock_threshold || 5,

        allow_credit_sales: Boolean(setting.allow_credit_sales),
        enable_daily_closing: Boolean(setting.enable_daily_closing),
        prevent_sale_after_closing: Boolean(setting.prevent_sale_after_closing),
        prevent_expense_after_closing: Boolean(setting.prevent_expense_after_closing),
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('company-settings.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const Checkbox = ({ label, checked, onChange }) => (
        <label className="flex items-center gap-3 rounded-lg border border-gray-200 p-4">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </label>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold text-gray-800">Company Settings</h2>}
        >
            <Head title="Company Settings" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Company Details
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.company_name && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.company_name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Phone
                                    </label>
                                    <input
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.phone && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.phone}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.email && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Logo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('logo', e.target.files[0] ?? null)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    {errors.logo && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.logo}
                                        </div>
                                    )}

                                    {setting.logo_url && (
                                        <img
                                            src={setting.logo_url}
                                            alt="Company Logo"
                                            className="mt-3 h-16 rounded border object-contain"
                                        />
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        rows="3"
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.address && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.address}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Receipt Settings
                            </h3>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Invoice Prefix
                                    </label>
                                    <input
                                        value={data.invoice_prefix}
                                        onChange={(e) => setData('invoice_prefix', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.invoice_prefix && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.invoice_prefix}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Purchase Prefix
                                    </label>
                                    <input
                                        value={data.purchase_prefix}
                                        onChange={(e) => setData('purchase_prefix', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.purchase_prefix && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.purchase_prefix}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Receipt Width
                                    </label>
                                    <select
                                        value={data.receipt_width}
                                        onChange={(e) => setData('receipt_width', e.target.value)}
                                        className="w-full rounded-lg border-gray-300"
                                    >
                                        <option value="58mm">58mm</option>
                                        <option value="80mm">80mm</option>
                                        <option value="A4">A4</option>
                                    </select>
                                    {errors.receipt_width && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.receipt_width}
                                        </div>
                                    )}
                                </div>

                                <div className="md:col-span-3">
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Receipt Footer
                                    </label>
                                    <textarea
                                        value={data.receipt_footer}
                                        onChange={(e) => setData('receipt_footer', e.target.value)}
                                        rows="3"
                                        className="w-full rounded-lg border-gray-300"
                                    />
                                    {errors.receipt_footer && (
                                        <div className="mt-1 text-sm text-red-600">
                                            {errors.receipt_footer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                POS Rules
                            </h3>

                            <div className="mb-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Low Stock Threshold
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.low_stock_threshold}
                                    onChange={(e) => setData('low_stock_threshold', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 md:w-64"
                                />
                                {errors.low_stock_threshold && (
                                    <div className="mt-1 text-sm text-red-600">
                                        {errors.low_stock_threshold}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Checkbox
                                    label="Allow Credit Sales"
                                    checked={data.allow_credit_sales}
                                    onChange={(value) => setData('allow_credit_sales', value)}
                                />

                                <Checkbox
                                    label="Enable Daily Closing"
                                    checked={data.enable_daily_closing}
                                    onChange={(value) => setData('enable_daily_closing', value)}
                                />

                                <Checkbox
                                    label="Prevent Sale After Daily Closing"
                                    checked={data.prevent_sale_after_closing}
                                    onChange={(value) => setData('prevent_sale_after_closing', value)}
                                />

                                <Checkbox
                                    label="Prevent Expense After Daily Closing"
                                    checked={data.prevent_expense_after_closing}
                                    onChange={(value) => setData('prevent_expense_after_closing', value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-slate-900 px-6 py-2 text-white disabled:opacity-50"
                            >
                                {processing ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
