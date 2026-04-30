<?php

namespace App\Exports;

use App\Models\SaleItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProfitByProductExport implements FromCollection, WithHeadings
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        return SaleItem::query()
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->leftJoin('categories', 'products.category_id', '=', 'categories.id')
            ->leftJoin('brands', 'products.brand_id', '=', 'brands.id')
            ->select([
                'products.id as product_id',
                'products.name as product_name',
                'products.sku as sku',
                'categories.name as category_name',
                'brands.name as brand_name',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.quantity * sale_items.unit_price) as sales_amount'),
                DB::raw('SUM(sale_items.quantity * products.cost_price) as cost_amount'),
                DB::raw('(SUM(sale_items.quantity * sale_items.unit_price) - SUM(sale_items.quantity * products.cost_price)) as gross_profit'),
            ])
            ->when($this->filters['from_date'] ?? null, fn ($q, $date) =>
                $q->whereDate('sale_headers.sale_date', '>=', $date)
            )
            ->when($this->filters['to_date'] ?? null, fn ($q, $date) =>
                $q->whereDate('sale_headers.sale_date', '<=', $date)
            )
            ->when($this->filters['branch_id'] ?? null, fn ($q, $branchId) =>
                $q->where('sale_headers.branch_id', $branchId)
            )
            ->when($this->filters['category_id'] ?? null, fn ($q, $categoryId) =>
                $q->where('products.category_id', $categoryId)
            )
            ->when($this->filters['brand_id'] ?? null, fn ($q, $brandId) =>
                $q->where('products.brand_id', $brandId)
            )
            ->when($this->filters['search'] ?? null, function ($q, $search) {
                $q->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('products.name', 'like', "%{$search}%")
                        ->orWhere('products.sku', 'like', "%{$search}%")
                        ->orWhere('products.barcode', 'like', "%{$search}%");
                });
            })
            ->groupBy([
                'products.id',
                'products.name',
                'products.sku',
                'categories.name',
                'brands.name',
            ])
            ->orderByDesc('gross_profit')
            ->get()
            ->map(function ($row) {
                $salesAmount = (float) $row->sales_amount;
                $grossProfit = (float) $row->gross_profit;

                return [
                    'Product' => $row->product_name,
                    'SKU' => $row->sku ?? '-',
                    'Category' => $row->category_name ?? '-',
                    'Brand' => $row->brand_name ?? '-',
                    'Sold Quantity' => (float) $row->total_qty,
                    'Sales Amount' => $salesAmount,
                    'Cost Amount' => (float) $row->cost_amount,
                    'Gross Profit' => $grossProfit,
                    'Profit Margin %' => $salesAmount > 0
                        ? round(($grossProfit / $salesAmount) * 100, 2)
                        : 0,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Product',
            'SKU',
            'Category',
            'Brand',
            'Sold Quantity',
            'Sales Amount',
            'Cost Amount',
            'Gross Profit',
            'Profit Margin %',
        ];
    }
}
