<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StockMovementReportExport implements FromCollection, WithHeadings
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        $dateFrom = $this->filters['date_from'] ?? null;
        $dateTo = $this->filters['date_to'] ?? null;
        $branchId = $this->filters['branch_id'] ?? null;
        $productId = $this->filters['product_id'] ?? null;
        $type = $this->filters['type'] ?? null;

        return DB::table('stock_movements')
            ->leftJoin('branches', 'stock_movements.branch_id', '=', 'branches.id')
            ->leftJoin('products', 'stock_movements.product_id', '=', 'products.id')
            ->leftJoin('users', 'stock_movements.created_by', '=', 'users.id')
            ->when($dateFrom, fn ($q) => $q->whereDate('stock_movements.created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('stock_movements.created_at', '<=', $dateTo))
            ->when($branchId, fn ($q) => $q->where('stock_movements.branch_id', $branchId))
            ->when($productId, fn ($q) => $q->where('stock_movements.product_id', $productId))
            ->when($type, fn ($q) => $q->where('stock_movements.type', $type))
            ->orderByDesc('stock_movements.created_at')
            ->orderByDesc('stock_movements.id')
            ->select([
                'stock_movements.created_at',
                'products.name as product',
                'stock_movements.type',
                'stock_movements.qty_in',
                'stock_movements.qty_out',
                'stock_movements.balance_after',
                'branches.name as branch',
                'users.name as user',
            ])
            ->get()
            ->map(function ($row) {
                return [
                    optional(\Carbon\Carbon::parse($row->created_at))->format('Y-m-d H:i:s'),
                    $row->product ?? '-',
                    $row->type,
                    (float) $row->qty_in,
                    (float) $row->qty_out,
                    (float) $row->balance_after,
                    $row->branch ?? '-',
                    $row->user ?? '-',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Date Time',
            'Product',
            'Type',
            'Qty In',
            'Qty Out',
            'Balance After',
            'Branch',
            'User',
        ];
    }
}
