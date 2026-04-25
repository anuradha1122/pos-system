<?php

namespace App\Services\CustomerCredit;

use App\Models\Payment;
use App\Models\SaleHeader;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustomerCreditService
{
    public function receivePayment(array $data): SaleHeader
    {
        return DB::transaction(function () use ($data) {
            $sale = SaleHeader::query()
                ->lockForUpdate()
                ->findOrFail($data['sale_id']);

            $amount = (float) $data['amount'];

            if ($amount > (float) $sale->balance_amount) {
                throw ValidationException::withMessages([
                    'amount' => 'Payment amount cannot exceed balance amount.',
                ]);
            }

            $newPaidAmount = (float) $sale->paid_amount + $amount;
            $newBalanceAmount = (float) $sale->grand_total - $newPaidAmount;

            $paymentStatus = match (true) {
                $newBalanceAmount <= 0 => 'paid',
                $newPaidAmount > 0 => 'partial',
                default => 'credit',
            };

            $sale->update([
                'paid_amount' => $newPaidAmount,
                'balance_amount' => $newBalanceAmount,
                'payment_status' => $paymentStatus,
            ]);

            Payment::create([
                'reference_type' => 'sale',
                'reference_id' => $sale->id,
                'branch_id' => $sale->branch_id,
                'type' => 'in',
                'amount' => $amount,
                'method' => $data['method'],
                'note' => $data['note'] ?? 'Customer credit payment',
                'created_by' => Auth::id(),
            ]);

            return $sale;
        });
    }
}
