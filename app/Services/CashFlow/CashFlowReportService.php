<?php

namespace App\Services\CashFlow;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;

class CashFlowReportService
{
    public function getReport(array $filters): array
    {
        $query = $this->baseQuery($filters);

        $payments = (clone $query)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $summaryQuery = $this->baseQuery($filters);

        $totalIn = (clone $summaryQuery)
            ->where('type', 'in')
            ->sum('amount');

        $totalOut = (clone $summaryQuery)
            ->where('type', 'out')
            ->sum('amount');

        $methodTotals = (clone $summaryQuery)
            ->selectRaw('method, SUM(amount) as total')
            ->groupBy('method')
            ->pluck('total', 'method');

        return [
            'payments' => $payments,
            'summary' => [
                'total_in' => (float) $totalIn,
                'total_out' => (float) $totalOut,
                'net_cash_flow' => (float) $totalIn - (float) $totalOut,
                'cash_total' => (float) ($methodTotals['cash'] ?? 0),
                'card_total' => (float) ($methodTotals['card'] ?? 0),
                'bank_total' => (float) ($methodTotals['bank'] ?? 0),
                'credit_total' => (float) ($methodTotals['credit'] ?? 0),
            ],
        ];
    }

    private function baseQuery(array $filters): Builder
    {
        return Payment::query()
            ->with([
                'branch:id,name',
                'creator:id,name',
            ])
            ->when($filters['from_date'] ?? null, function ($query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($filters['to_date'] ?? null, function ($query, $date) {
                $query->whereDate('created_at', '<=', $date);
            })
            ->when($filters['branch_id'] ?? null, function ($query, $branchId) {
                $query->where('branch_id', $branchId);
            })
            ->when($filters['method'] ?? null, function ($query, $method) {
                $query->where('method', $method);
            })
            ->when($filters['type'] ?? null, function ($query, $type) {
                $query->where('type', $type);
            });
    }
}
