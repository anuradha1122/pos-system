<?php

namespace App\Services\Reports;

use App\Models\BranchProductStock;
use Illuminate\Database\Eloquent\Builder;

class InventoryValuationReportService
{
    public function getReport(array $filters): array
    {
        $query = $this->baseQuery($filters);

        $stocks = (clone $query)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $summaryRows = (clone $query)->get();

        $totalQuantity = $summaryRows->sum('quantity');

        $totalValue = $summaryRows->sum(function ($stock) {
            return (float) $stock->quantity * (float) ($stock->product->cost_price ?? 0);
        });

        $lowStockCount = $summaryRows->filter(function ($stock) {
            return (float) $stock->quantity <= (float) $stock->reorder_level;
        })->count();

        return [
            'stocks' => $stocks,
            'summary' => [
                'total_quantity' => (float) $totalQuantity,
                'total_inventory_value' => (float) $totalValue,
                'low_stock_count' => $lowStockCount,
            ],
        ];
    }

    private function baseQuery(array $filters): Builder
    {
        return BranchProductStock::query()
            ->with([
                'branch:id,name',
                'product:id,name,sku,cost_price,category_id,brand_id',
                'product.category:id,name',
                'product.brand:id,name',
            ])
            ->when($filters['branch_id'] ?? null, function ($query, $branchId) {
                $query->where('branch_id', $branchId);
            })
            ->when($filters['category_id'] ?? null, function ($query, $categoryId) {
                $query->whereHas('product', function ($productQuery) use ($categoryId) {
                    $productQuery->where('category_id', $categoryId);
                });
            })
            ->when($filters['brand_id'] ?? null, function ($query, $brandId) {
                $query->whereHas('product', function ($productQuery) use ($brandId) {
                    $productQuery->where('brand_id', $brandId);
                });
            })
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('product', function ($productQuery) use ($search) {
                    $productQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                });
            });
    }
}
