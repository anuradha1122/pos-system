<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchProductStock;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockBalanceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $branchId = $request->string('branch_id')->toString();
        $lowStock = $request->string('low_stock')->toString();

        $stocks = BranchProductStock::query()
            ->with([
                'branch:id,name',
                'product:id,name,sku,reorder_level,unit_id,category_id',
                'product.unit:id,name',
                'product.category:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('product', function ($productQuery) use ($search) {
                    $productQuery->where(function ($subQuery) use ($search) {
                        $subQuery
                            ->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%");
                    });
                });
            })
            ->when($branchId !== '', function ($query) use ($branchId) {
                $query->where('branch_id', $branchId);
            })
            ->when($lowStock === '1', function ($query) {
                $query->whereHas('product', function ($productQuery) {
                    $productQuery->whereColumn('branch_product_stocks.quantity', '<=', 'products.reorder_level');
                });
            })
            ->orderBy('branch_id')
            ->orderBy('product_id')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($stock) {
                $reorderLevel = (float) $stock->product?->reorder_level;
                $quantity = (float) $stock->quantity;

                return [
                    'id' => $stock->id,
                    'quantity' => $stock->quantity,
                    'is_low_stock' => $quantity <= $reorderLevel,
                    'branch' => $stock->branch ? [
                        'id' => $stock->branch->id,
                        'name' => $stock->branch->name,
                    ] : null,
                    'product' => $stock->product ? [
                        'id' => $stock->product->id,
                        'name' => $stock->product->name,
                        'sku' => $stock->product->sku,
                        'reorder_level' => $stock->product->reorder_level,
                        'category' => $stock->product->category ? [
                            'id' => $stock->product->category->id,
                            'name' => $stock->product->category->name,
                        ] : null,
                        'unit' => $stock->product->unit ? [
                            'id' => $stock->product->unit->id,
                            'name' => $stock->product->unit->name,
                        ] : null,
                    ] : null,
                ];
            });

        return Inertia::render('StockBalances/Index', [
            'stocks' => $stocks,
            'filters' => [
                'search' => $search,
                'branch_id' => $branchId,
                'low_stock' => $lowStock,
            ],
            'branches' => Branch::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }
}
