<?php

namespace App\Services\Sale;

use App\Models\CompanySetting;
use App\Models\SaleHeader;

class SaleDocumentService
{
    public function getSaleForDocument(int $saleId): SaleHeader
    {
        return SaleHeader::query()
            ->with([
                'branch',
                'customer',
                'items.product',
                'payments',
                'creator',
            ])
            ->findOrFail($saleId);
    }

    public function getCompany(): array
    {
        $setting = CompanySetting::first();

        return [
            'name' => $setting?->company_name ?? 'POS System',
            'address' => $setting?->address,
            'phone' => $setting?->phone,
            'email' => $setting?->email,
            'logo' => $setting?->logo,
            'logo_url' => $setting?->logo
                ? asset('storage/' . $setting->logo)
                : null,
            'receipt_footer' => $setting?->receipt_footer ?? 'Thank you for your business.',
            'receipt_width' => $setting?->receipt_width ?? '80mm',
        ];
    }

    public function buildTotals(SaleHeader $sale): array
    {
        $subtotal = (float) $sale->subtotal;
        $discount = (float) $sale->discount;
        $tax = (float) $sale->tax;
        $grandTotal = (float) $sale->grand_total;

        $paidAmount = (float) (
            $sale->paid_amount
            ?? $sale->payments->where('type', 'in')->sum('amount')
        );

        $balanceAmount = (float) (
            $sale->balance_amount
            ?? max($grandTotal - $paidAmount, 0)
        );

        return [
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'grand_total' => $grandTotal,
            'paid_amount' => $paidAmount,
            'balance_amount' => $balanceAmount,
        ];
    }
}
