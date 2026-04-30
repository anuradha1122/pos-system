<?php

namespace App\Services\Statement;

use App\Models\Customer;
use App\Models\Payment;
use App\Models\SaleHeader;
use App\Models\SaleReturn;
use Carbon\Carbon;

class CustomerStatementService
{
    public function getCustomers(array $filters = [])
    {
        $search = $filters['search'] ?? null;

        return Customer::query()
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

    public function getStatement(Customer $customer, array $filters = []): array
    {
        $branchId = auth()->user()->branch_id;

        $from = !empty($filters['from'])
            ? Carbon::parse($filters['from'])->startOfDay()
            : null;

        $to = !empty($filters['to'])
            ? Carbon::parse($filters['to'])->endOfDay()
            : null;

        $sales = SaleHeader::query()
            ->where('branch_id', $branchId)
            ->where('customer_id', $customer->id)
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($sale) {
                return [
                    'date' => $sale->sale_date ?? $sale->created_at,
                    'type' => 'Sale',
                    'reference' => 'SALE #' . $sale->id,
                    'debit' => (float) $sale->grand_total,
                    'credit' => 0,
                    'description' => 'Customer sale',
                ];
            });

        $payments = Payment::query()
            ->where('branch_id', $branchId)
            ->where('reference_type', 'customer')
            ->where('reference_id', $customer->id)
            ->where('type', 'in')
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($payment) {
                return [
                    'date' => $payment->payment_date ?? $payment->created_at,
                    'type' => 'Payment',
                    'reference' => 'PAY #' . $payment->id,
                    'debit' => 0,
                    'credit' => (float) $payment->amount,
                    'description' => $payment->method,
                ];
            });

        $returns = SaleReturn::query()
            ->where('branch_id', $branchId)
            ->where('customer_id', $customer->id)
            ->when($from, fn ($query) => $query->where('created_at', '>=', $from))
            ->when($to, fn ($query) => $query->where('created_at', '<=', $to))
            ->get()
            ->map(function ($return) {
                return [
                    'date' => $return->return_date ?? $return->created_at,
                    'type' => 'Sale Return',
                    'reference' => 'RETURN #' . $return->id,
                    'debit' => 0,
                    'credit' => (float) $return->grand_total,
                    'description' => 'Returned goods',
                ];
            });

        $transactions = collect()
            ->merge($sales)
            ->merge($payments)
            ->merge($returns)
            ->sortBy('date')
            ->values();

        $runningBalance = 0;

        $transactions = $transactions->map(function ($transaction) use (&$runningBalance) {
            $runningBalance += $transaction['debit'];
            $runningBalance -= $transaction['credit'];

            $transaction['balance'] = $runningBalance;

            return $transaction;
        });

        return [
            'customer' => $customer,
            'filters' => [
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
            'transactions' => $transactions,
            'summary' => [
                'total_sales' => $transactions->sum('debit'),
                'total_paid' => $transactions->sum('credit'),
                'outstanding' => $runningBalance,
            ],
        ];
    }
}
