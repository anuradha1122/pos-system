<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStockAdjustmentRequest;
use App\Models\Branch;
use App\Models\Product;
use App\Models\StockMovement;
use App\Services\Stock\StockService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class StockAdjustmentController extends Controller
{
    public function __construct(protected StockService $stockService)
    {
    }

    public function index(Request $request): Response
    {
        $movements = StockMovement::query()
            ->with([
                'branch:id,name',
                'product:id,name,sku',
                'creator:id,name',
            ])
            ->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($movement) {
                $qtyIn = $movement->qty_in ?? 0;
                $qtyOut = $movement->qty_out ?? 0;

                if ($movement->type === 'sale' && (float) $qtyOut === 0) {
                    $qtyOut = $movement->quantity ?? 0;
                }

                return [
                    'id' => $movement->id,
                    'type' => $movement->type,
                    'qty_in' => $qtyIn,
                    'qty_out' => $qtyOut,
                    'balance_after' => $movement->balance_after,
                    'note' => $movement->note,
                    'created_at' => $movement->created_at?->format('Y-m-d H:i'),
                    'branch' => $movement->branch ? [
                        'id' => $movement->branch->id,
                        'name' => $movement->branch->name,
                    ] : null,
                    'product' => $movement->product ? [
                        'id' => $movement->product->id,
                        'name' => $movement->product->name,
                        'sku' => $movement->product->sku,
                    ] : null,
                    'creator' => $movement->creator ? [
                        'id' => $movement->creator->id,
                        'name' => $movement->creator->name,
                    ] : null,
                ];
            });

        return Inertia::render('StockAdjustments/Index', [
            'movements' => $movements,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('StockAdjustments/Create', [
            'branches' => Branch::query()->select('id', 'name')->orderBy('name')->get(),
            'products' => Product::query()
                ->select('id', 'name', 'sku', 'is_active')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StoreStockAdjustmentRequest $request): RedirectResponse
    {
        try {
            $this->stockService->adjust($request->validated());

            return redirect()
                ->route('stock-adjustments.index')
                ->with('success', 'Stock adjustment completed successfully.');
        } catch (RuntimeException $e) {
            return redirect()
                ->back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }
}
