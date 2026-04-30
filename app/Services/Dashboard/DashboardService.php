<?php

namespace App\Services\Dashboard;

use App\Models\BranchProductStock;
use App\Models\CompanySetting;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\PurchaseHeader;
use App\Models\SaleHeader;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getDashboardData(array $filters): array
    {
        $user = auth()->user();

        $branchId = $user->branch_id;

        // Super admin/admin can see all branches.
        if ($user->hasRole('super-admin') || $user->hasRole('admin')) {
            $branchId = null;
        }

        $from = Carbon::parse($filters['from'])->startOfDay();
        $to = Carbon::parse($filters['to'])->endOfDay();

        $sales = SaleHeader::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereBetween('created_at', [$from, $to])
            ->sum('grand_total');

        $purchases = PurchaseHeader::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereBetween('created_at', [$from, $to])
            ->sum('grand_total');

        $expenses = Expense::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereBetween('created_at', [$from, $to])
            ->sum('amount');

        $cashIn = Payment::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->where('type', 'in')
            ->whereBetween('created_at', [$from, $to])
            ->sum('amount');

        $cashOut = Payment::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->where('type', 'out')
            ->whereBetween('created_at', [$from, $to])
            ->sum('amount');

        $receivablesTotal = SaleHeader::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereIn('payment_status', ['partial', 'credit'])
            ->sum('balance_amount');

        $payablesTotal = PurchaseHeader::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereIn('payment_status', ['partial', 'credit'])
            ->sum('balance_amount');

        return [
            'summary' => [
                'today_sales' => (float) $sales,
                'today_purchases' => (float) $purchases,
                'today_expenses' => (float) $expenses,
                'today_in' => (float) $cashIn,
                'today_out' => (float) $cashOut,
                'today_net' => (float) $cashIn - (float) $cashOut,
                'receivables_total' => (float) $receivablesTotal,
                'payables_total' => (float) $payablesTotal,
                'low_stock_count' => $this->lowStockCount($branchId),
            ],
            'cash_flow_last_7_days' => $this->cashFlowByDateRange($branchId, $from, $to),
            'method_breakdown' => $this->paymentMethodBreakdown($branchId, $from, $to),
            'quick_links' => $this->quickLinks(),
        ];
    }

    private function cashFlowByDateRange(?int $branchId, Carbon $from, Carbon $to): array
    {
        $rows = Payment::query()
            ->selectRaw('DATE(created_at) as date')
            ->selectRaw("SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END) as total_in")
            ->selectRaw("SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END) as total_out")
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereBetween('created_at', [$from, $to])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $data = [];

        $cursor = $from->copy()->startOfDay();
        $end = $to->copy()->startOfDay();

        while ($cursor->lte($end)) {
            $date = $cursor->toDateString();

            $data[] = [
                'date' => $date,
                'in' => (float) ($rows[$date]->total_in ?? 0),
                'out' => (float) ($rows[$date]->total_out ?? 0),
            ];

            $cursor->addDay();
        }

        return $data;
    }

    private function paymentMethodBreakdown(?int $branchId, Carbon $from, Carbon $to): array
    {
        return Payment::query()
            ->select('method')
            ->selectRaw('SUM(amount) as total')
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('method')
            ->orderBy('method')
            ->get()
            ->map(fn ($row) => [
                'method' => strtoupper($row->method ?? 'UNKNOWN'),
                'total' => (float) $row->total,
            ])
            ->values()
            ->toArray();
    }

    private function lowStockCount(?int $branchId): int
    {
        $threshold = (int) (CompanySetting::query()->value('low_stock_threshold') ?? 10);

        return BranchProductStock::query()
            ->when($branchId, fn (Builder $query) => $query->where('branch_id', $branchId))
            ->where('quantity', '<=', $threshold)
            ->count();
    }

    private function quickLinks(): array
    {
        return [
            ['label' => 'New Sale', 'route' => 'sales.create', 'permission' => 'sale.create'],
            ['label' => 'New Purchase', 'route' => 'purchases.create', 'permission' => 'purchase.create'],
            ['label' => 'Add Payment', 'route' => 'payments.create', 'permission' => 'payment.create'],
            ['label' => 'Add Expense', 'route' => 'expenses.create', 'permission' => 'expense.create'],
            ['label' => 'Daily Closing', 'route' => 'daily-closings.create', 'permission' => 'daily-closing.create'],
            ['label' => 'Reports', 'route' => 'reports.sales', 'permission' => 'report.sales.view'],
        ];
    }
}
