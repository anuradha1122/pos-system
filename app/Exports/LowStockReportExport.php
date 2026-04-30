<?php

namespace App\Exports;

use App\Models\CompanySetting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class LowStockReportExport implements FromCollection, WithHeadings
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        $search = $this->filters['search'] ?? null;
        $branchId = $this->filters['branch_id'] ?? null;
        $onlyLow = ($this->filters['only_low'] ?? 0) == 1;

        $setting = CompanySetting::first();
        $defaultThreshold = (float) ($setting?->low_stock_threshold ?? 5);

        $query = DB::table('branch_product_stocks')
            ->join('branches', 'branch_product_stocks.branch_id', '=', 'branches.id')
            ->join('products', 'branch_product_stocks.product_id', '=', 'products.id')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('products.name', 'like', '%' . $search . '%')
                        ->orWhere('products.sku', 'like', '%' . $search . '%');
                });
            })
            ->when($branchId, fn ($q) => $q->where('branch_product_stocks.branch_id', $branchId))
            ->select([
                'branch_product_stocks.id',
                'products.name as product',
                'products.sku',
                'branches.name as branch',
                'branch_product_stocks.quantity',
                'branch_product_stocks.reorder_level',

                DB::raw("
                    CASE
                        WHEN branch_product_stocks.reorder_level > 0
                        THEN branch_product_stocks.reorder_level
                        ELSE {$defaultThreshold}
                    END as effective_reorder_level
                "),
            ]);

        if ($onlyLow) {
            $query->whereRaw("
                branch_product_stocks.quantity <=
                CASE
                    WHEN branch_product_stocks.reorder_level > 0
                    THEN branch_product_stocks.reorder_level
                    ELSE ?
                END
            ", [$defaultThreshold]);
        }

        return $query
            ->orderBy('products.name')
            ->get()
            ->map(function ($row) {
                $quantity = (float) $row->quantity;
                $threshold = (float) $row->effective_reorder_level;

                $isLow = $quantity <= $threshold;
                $shortage = $isLow ? max($threshold - $quantity, 0) : 0;

                return [
                    $row->product,
                    $row->sku,
                    $row->branch,
                    $quantity,
                    $threshold,
                    $isLow ? 'Low' : 'OK',
                    $shortage > 0 ? $shortage : '-',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Product',
            'SKU',
            'Branch',
            'Quantity',
            'Threshold',
            'Status',
            'Shortage',
        ];
    }
}
