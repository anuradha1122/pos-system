<?php

namespace App\Exports;

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
                DB::raw('CASE WHEN branch_product_stocks.quantity <= branch_product_stocks.reorder_level AND branch_product_stocks.reorder_level > 0 THEN 1 ELSE 0 END as is_low'),
                DB::raw('CASE WHEN branch_product_stocks.quantity <= branch_product_stocks.reorder_level THEN (branch_product_stocks.reorder_level - branch_product_stocks.quantity) ELSE 0 END as shortage'),
            ]);

        if ($onlyLow) {
            $query->whereColumn('branch_product_stocks.quantity', '<=', 'branch_product_stocks.reorder_level')
                  ->where('branch_product_stocks.reorder_level', '>', 0);
        }

        return $query
            ->orderBy('products.name')
            ->get()
            ->map(function ($row) {
                return [
                    $row->product,
                    $row->sku,
                    $row->branch,
                    (float) $row->quantity,
                    (float) $row->reorder_level,
                    (int) $row->is_low === 1 ? 'Low' : 'OK',
                    (float) $row->shortage > 0 ? (float) $row->shortage : '-',
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
            'Reorder Level',
            'Status',
            'Shortage',
        ];
    }
}
