<?php

namespace App\Services\Payment;

use App\Models\CompanySetting;
use App\Models\Payment;

class PaymentDocumentService
{
    public function getPaymentForReceipt(int $paymentId): Payment
    {
        return Payment::query()
            ->with([
                'branch:id,name',
                'customer:id,name,phone',
                'supplier:id,name,phone',
                'creator:id,name',
            ])
            ->where('branch_id', auth()->user()->branch_id)
            ->findOrFail($paymentId);
    }

    public function getCompany(): ?CompanySetting
    {
        return CompanySetting::query()->first();
    }

    public function buildReceiptNo(Payment $payment): string
    {
        return 'PAY-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT);
    }
}
