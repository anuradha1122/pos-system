<?php

namespace App\Services\SupplierCredit;

use App\Models\Payment;
use App\Models\PurchaseHeader;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupplierCreditService
{
    public function makePayment(array $data): PurchaseHeader
    {
        return DB::transaction(function () use ($data) {
            $purchase = PurchaseHeader::query()
                ->lockForUpdate()
                ->findOrFail($data['purchase_id']);

            $amount = (float) $data['amount'];

            if ($amount > (float) $purchase->balance_amount) {
                throw ValidationException::withMessages([
                    'amount' => 'Payment amount cannot exceed balance amount.',
                ]);
            }

            $newPaidAmount = (float) $purchase->paid_amount + $amount;
            $newBalanceAmount = (float) $purchase->total_amount - $newPaidAmount;

            $paymentStatus = match (true) {
                $newBalanceAmount <= 0 => 'paid',
                $newPaidAmount > 0 => 'partial',
                default => 'credit',
            };

            $purchase->update([
                'paid_amount' => $newPaidAmount,
                'balance_amount' => $newBalanceAmount,
                'payment_status' => $paymentStatus,
            ]);

            Payment::create([
                'reference_type' => 'purchase',
                'reference_id' => $purchase->id,
                'branch_id' => $purchase->branch_id,
                'type' => 'out',
                'amount' => $amount,
                'method' => $data['method'],
                'note' => $data['note'] ?? 'Supplier credit payment',
                'created_by' => Auth::id(),
            ]);

            return $purchase;
        });
    }
}
