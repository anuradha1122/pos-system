<?php

namespace App\Services\Statement;

use App\Models\Payment;
use App\Models\PurchaseHeader;
use App\Models\PurchaseReturn;
use App\Models\Supplier;
use Carbon\Carbon;

class SupplierStatementService
{
    public function getSuppliers(array $filters = [])
    {
        $search = $filters['search'] ?? null;

        return Supplier::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function getStatement(Supplier $supplier, array $filters = []): array
    {
        $branchId = auth()->user()->branch_id;

        $from = !empty($filters['from'])
            ? Carbon::parse($filters['from'])->startOfDay()
            : null;

        $to = !empty($filters['to'])
            ? Carbon::parse($filters['to'])->endOfDay()
            : null;

        $purchases = PurchaseHeader::query()
            ->where('branch_id', $branchId)
            ->where('supplier_id', $supplier->id)
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($purchase) {
                return [
                    'date' => $purchase->purchase_date ?? $purchase->created_at,
                    'type' => 'Purchase',
                    'reference' => 'PURCHASE #' . $purchase->id,
                    'debit' => 0,
                    'credit' => (float) $purchase->grand_total,
                    'description' => 'Supplier purchase',
                ];
            });

        $payments = Payment::query()
            ->where('branch_id', $branchId)
            ->where('reference_type', 'supplier')
            ->where('reference_id', $supplier->id)
            ->where('type', 'out')
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($payment) {
                return [
                    'date' => $payment->payment_date ?? $payment->created_at,
                    'type' => 'Payment',
                    'reference' => 'PAY #' . $payment->id,
                    'debit' => (float) $payment->amount,
                    'credit' => 0,
                    'description' => $payment->method,
                ];
            });

        $returns = PurchaseReturn::query()
            ->where('branch_id', $branchId)
            ->where('supplier_id', $supplier->id)
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($return) {
                return [
                    'date' => $return->return_date ?? $return->created_at,
                    'type' => 'Purchase Return',
                    'reference' => 'RETURN #' . $return->id,
                    'debit' => (float) $return->grand_total,
                    'credit' => 0,
                    'description' => 'Returned goods to supplier',
                ];
            });

        $transactions = collect()
            ->merge($purchases)
            ->merge($payments)
            ->merge($returns)
            ->sortBy('date')
            ->values();

        $runningBalance = 0;

        $transactions = $transactions->map(function ($transaction) use (&$runningBalance) {
            $runningBalance += $transaction['credit'];
            $runningBalance -= $transaction['debit'];

            $transaction['balance'] = $runningBalance;

            return $transaction;
        });

        return [
            'supplier' => $supplier,
            'filters' => [
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
            'transactions' => $transactions,
            'summary' => [
                'total_purchases' => $transactions->sum('credit'),
                'total_paid_or_returned' => $transactions->sum('debit'),
                'outstanding' => $runningBalance,
            ],
        ];
    }
}
