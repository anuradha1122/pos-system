<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\SaleHeader;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function sales(Request $request): Response
    {
        $dateFrom = $request->string('date_from')->toString();
        $dateTo = $request->string('date_to')->toString();
        $customerId = $request->string('customer_id')->toString();
        $branchId = $request->string('branch_id')->toString();

        $salesQuery = SaleHeader::query()
            ->with([
                'customer:id,name',
                'branch:id,name',
                'creator:id,name',
            ])
            ->when($dateFrom, function ($query) use ($dateFrom) {
                $query->whereDate('sale_date', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                $query->whereDate('sale_date', '<=', $dateTo);
            })
            ->when($customerId, function ($query) use ($customerId) {
                $query->where('customer_id', $customerId);
            })
            ->when($branchId, function ($query) use ($branchId) {
                $query->where('branch_id', $branchId);
            })
            ->latest('sale_date');

        $summary = [
            'total_invoices' => (clone $salesQuery)->count(),
            'total_amount' => (clone $salesQuery)->sum('grand_total'),
        ];

        $sales = $salesQuery
            ->paginate(15)
            ->withQueryString()
            ->through(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_no' => $sale->invoice_no,
                    'sale_date' => $sale->sale_date?->format('Y-m-d'),
                    'customer' => $sale->customer ? [
                        'id' => $sale->customer->id,
                        'name' => $sale->customer->name,
                    ] : null,
                    'branch' => $sale->branch ? [
                        'id' => $sale->branch->id,
                        'name' => $sale->branch->name,
                    ] : null,
                    'creator' => $sale->creator ? [
                        'id' => $sale->creator->id,
                        'name' => $sale->creator->name,
                    ] : null,
                    'grand_total' => $sale->grand_total,
                ];
            });

        $customers = Customer::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $branches = Branch::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Reports/Sales', [
            'sales' => $sales,
            'customers' => $customers,
            'branches' => $branches,
            'summary' => $summary,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'customer_id' => $customerId,
                'branch_id' => $branchId,
            ],
        ]);
    }

    public function stockMovements(Request $request): Response
    {
        $dateFrom = $request->string('date_from')->toString();
        $dateTo = $request->string('date_to')->toString();
        $branchId = $request->string('branch_id')->toString();
        $productId = $request->string('product_id')->toString();
        $type = $request->string('type')->toString();

        $query = \App\Models\StockMovement::query()
            ->with([
                'branch:id,name',
                'product:id,name,sku',
                'creator:id,name',
            ])
            ->when($dateFrom, fn ($q) => $q->whereDate('created_at', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('created_at', '<=', $dateTo))
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($productId, fn ($q) => $q->where('product_id', $productId))
            ->when($type, fn ($q) => $q->where('type', $type))
            ->latest();

        $movements = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function ($m) {
                return [
                    'id' => $m->id,
                    'date' => $m->created_at?->format('Y-m-d H:i'),
                    'type' => $m->type,
                    'qty_in' => $m->qty_in ?? 0,
                    'qty_out' => $m->qty_out ?? 0,
                    'balance_after' => $m->balance_after,
                    'note' => $m->note,
                    'branch' => $m->branch?->name,
                    'product' => $m->product?->name,
                    'sku' => $m->product?->sku,
                    'user' => $m->creator?->name,
                ];
            });

        return Inertia::render('Reports/StockMovements', [
            'movements' => $movements,
            'branches' => \App\Models\Branch::select('id', 'name')->get(),
            'products' => \App\Models\Product::select('id', 'name')->get(),
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'branch_id' => $branchId,
                'product_id' => $productId,
                'type' => $type,
            ],
        ]);
    }

    public function lowStock(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $branchId = $request->string('branch_id')->toString();
        $onlyLow = $request->boolean('only_low');

        $query = \App\Models\BranchProductStock::query()
            ->with(['product:id,name,sku', 'branch:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->whereHas('product', function ($sub) use ($search) {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%");
                });
            })
            ->when($branchId, fn ($q) => $q->where('branch_id', $branchId))
            ->when($onlyLow, function ($q) {
                $q->whereColumn('quantity', '<=', 'reorder_level');
            });

        $stocks = $query
            ->paginate(15)
            ->withQueryString()
            ->through(function ($stock) {
                $qty = (float) $stock->quantity;
                $reorder = (float) ($stock->reorder_level ?? 0);

                return [
                    'id' => $stock->id,
                    'product' => $stock->product?->name,
                    'sku' => $stock->product?->sku,
                    'branch' => $stock->branch?->name,
                    'quantity' => $qty,
                    'reorder_level' => $reorder,
                    'is_low' => $qty <= $reorder,
                    'shortage' => $reorder - $qty,
                ];
            });

        return Inertia::render('Reports/LowStock', [
            'stocks' => $stocks,
            'branches' => \App\Models\Branch::select('id', 'name')->get(),
            'filters' => [
                'search' => $search,
                'branch_id' => $branchId,
                'only_low' => $onlyLow,
            ],
        ]);
    }
}
