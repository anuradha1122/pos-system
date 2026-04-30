<?php

namespace App\Services\Reports;

use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;

class ProfitByProductReportService
{
    public function getReport(array $filters): array
    {
        $query = SaleItem::query()
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
            ->when($filters['from_date'] ?? null, function ($query, $date) {
                $query->whereDate('sale_headers.sale_date', '>=', $date);
            })
            ->when($filters['to_date'] ?? null, function ($query, $date) {
                $query->whereDate('sale_headers.sale_date', '<=', $date);
            })
            ->when($filters['branch_id'] ?? null, function ($query, $branchId) {
                $query->where('sale_headers.branch_id', $branchId);
            })
            ->when($filters['category_id'] ?? null, function ($query, $categoryId) {
                $query->where('products.category_id', $categoryId);
            })
            ->when($filters['brand_id'] ?? null, function ($query, $brandId) {
                $query->where('products.brand_id', $brandId);
            })
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($subQuery) use ($search) {
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
            ->orderByDesc('gross_profit');

        $rows = $query->paginate(15)->withQueryString();

        $summaryRows = collect($rows->items());

        return [
            'rows' => $rows,
            'summary' => [
                'total_qty' => (float) $summaryRows->sum('total_qty'),
                'sales_amount' => (float) $summaryRows->sum('sales_amount'),
                'cost_amount' => (float) $summaryRows->sum('cost_amount'),
                'gross_profit' => (float) $summaryRows->sum('gross_profit'),
            ],
        ];
    }
}
