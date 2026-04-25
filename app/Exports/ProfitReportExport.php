<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProfitReportExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        $from = $this->filters['from'] ?? null;
        $to = $this->filters['to'] ?? null;
        $branchId = $this->filters['branch_id'] ?? null;
        $customerId = $this->filters['customer_id'] ?? null;
        $productId = $this->filters['product_id'] ?? null;

        return DB::table('sale_items')
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->leftJoin('customers', 'sale_headers.customer_id', '=', 'customers.id')
            ->join('branches', 'sale_headers.branch_id', '=', 'branches.id')
            ->when($from, fn ($q) => $q->whereDate('sale_headers.sale_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sale_headers.sale_date', '<=', $to))
            ->when($branchId, fn ($q) => $q->where('sale_headers.branch_id', $branchId))
            ->when($customerId, fn ($q) => $q->where('sale_headers.customer_id', $customerId))
            ->when($productId, fn ($q) => $q->where('sale_items.product_id', $productId))
            ->orderByDesc('sale_headers.sale_date')
            ->select([
                'sale_headers.sale_date',
                'sale_headers.invoice_no',
                'branches.name as branch',
                'customers.name as customer',
                'products.name as product',
                'sale_items.quantity',
                'sale_items.unit_price',
                DB::raw('(sale_items.quantity * sale_items.cost_price) as total_cost'),
                'sale_items.line_total',
                DB::raw('(sale_items.line_total - (sale_items.quantity * sale_items.cost_price)) as profit'),
            ])
            ->get();
    }

    public function headings(): array
    {
        return [
            'Date',
            'Invoice',
            'Branch',
            'Customer',
            'Product',
            'Quantity',
            'Unit Price',
            'Cost',
            'Sales',
            'Profit',
        ];
    }
}
