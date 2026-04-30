import { Head } from '@inertiajs/react';

export default function ThermalReceipt({ sale, totals, company }) {
    const money = (value) => Number(value || 0).toFixed(2);

    const widthClass = (() => {
        switch (company?.receipt_width) {
            case '58mm':
                return 'max-w-[220px]';
            case '80mm':
                return 'max-w-[300px]';
            case 'A4':
                return 'max-w-2xl';
            default:
                return 'max-w-[300px]';
        }
    })();

    return (
        <>
            <Head title={`Receipt ${sale?.invoice_no || ''}`} />

            <div className="flex min-h-screen justify-center bg-gray-100 p-6">
                <div className={`${widthClass} w-full bg-white p-4 text-xs text-gray-900 shadow`}>
                    <div className="mb-3 text-center">
                        {company?.logo_url && (
                            <img
                                src={company.logo_url}
                                alt="Logo"
                                className="mx-auto mb-2 h-12 object-contain"
                            />
                        )}

                        <div className="text-sm font-bold">
                            {company?.name || 'POS System'}
                        </div>

                        {company?.address && <div>{company.address}</div>}
                        {company?.phone && <div>Tel: {company.phone}</div>}
                        {company?.email && <div>{company.email}</div>}
                    </div>

                    <hr className="my-2 border-dashed" />

                    <div className="mb-2">
                        <div>Invoice: {sale?.invoice_no}</div>
                        <div>Date: {sale?.sale_date}</div>
                        {sale?.customer && <div>Customer: {sale.customer.name}</div>}
                    </div>

                    <hr className="my-2 border-dashed" />

                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="text-right">Qty</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(sale?.items || []).map((item, index) => (
                                <tr key={index}>
                                    <td className="pr-2">
                                        {item.product?.name || '-'}
                                    </td>
                                    <td className="text-right">{money(item.quantity)}</td>
                                    <td className="text-right">{money(item.unit_price)}</td>
                                    <td className="text-right">
                                        {money(Number(item.quantity || 0) * Number(item.unit_price || 0))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <hr className="my-2 border-dashed" />

                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{money(totals?.subtotal)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>{money(totals?.discount)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{money(totals?.tax)}</span>
                        </div>

                        <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{money(totals?.grand_total)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Paid</span>
                            <span>{money(totals?.paid_amount)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Balance</span>
                            <span>{money(totals?.balance_amount)}</span>
                        </div>
                    </div>

                    <hr className="my-2 border-dashed" />

                    <div className="mt-3 text-center">
                        {company?.receipt_footer && <div>{company.receipt_footer}</div>}

                        <div className="mt-2 text-[10px] text-gray-500">
                            Powered by Tecgaze POS
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
