<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseRequest;
use App\Models\Branch;
use App\Models\Product;
use App\Models\PurchaseHeader;
use App\Models\Supplier;
use App\Services\Purchase\PurchaseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseController extends Controller
{
    public function __construct(protected PurchaseService $purchaseService)
    {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $date = $request->string('date')->toString();
        $supplierId = $request->string('supplier_id')->toString();

        $purchases = PurchaseHeader::query()
            ->with([
                'branch:id,name',
                'supplier:id,name,phone',
                'creator:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('purchase_no', 'like', "%{$search}%")
                        ->orWhere('invoice_no', 'like', "%{$search}%");
                });
            })
            ->when($date, function ($query) use ($date) {
                $query->whereDate('purchase_date', $date);
            })
            ->when($supplierId, function ($query) use ($supplierId) {
                $query->where('supplier_id', $supplierId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($purchase) {
                return [
                    'id' => $purchase->id,
                    'purchase_no' => $purchase->purchase_no,
                    'invoice_no' => $purchase->invoice_no,
                    'purchase_date' => $purchase->purchase_date?->format('Y-m-d'),
                    'supplier' => $purchase->supplier ? [
                        'id' => $purchase->supplier->id,
                        'name' => $purchase->supplier->name,
                        'phone' => $purchase->supplier->phone,
                    ] : null,
                    'branch' => $purchase->branch ? [
                        'id' => $purchase->branch->id,
                        'name' => $purchase->branch->name,
                    ] : null,
                    'creator' => $purchase->creator ? [
                        'id' => $purchase->creator->id,
                        'name' => $purchase->creator->name,
                    ] : null,
                    'grand_total' => $purchase->grand_total,
                ];
            });

        $suppliers = Supplier::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'filters' => [
                'search' => $search,
                'date' => $date,
                'supplier_id' => $supplierId,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Purchases/Create', [
            'branches' => Branch::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'suppliers' => Supplier::query()
                ->select('id', 'name', 'phone')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
            'products' => Product::query()
                ->select('id', 'name', 'sku', 'cost_price', 'is_active')
                ->where('is_active', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(StorePurchaseRequest $request): RedirectResponse
    {
        $purchase = $this->purchaseService->create($request->validated());

        return redirect()
            ->route('purchases.show', $purchase->id)
            ->with('success', 'Purchase created successfully.');
    }

    public function show(PurchaseHeader $purchase): Response
    {
        $purchase->load([
            'branch:id,name',
            'supplier:id,name,phone,email,address',
            'creator:id,name',
            'items.product:id,name,sku',
        ]);

        return Inertia::render('Purchases/Show', [
            'purchase' => [
                'id' => $purchase->id,
                'purchase_no' => $purchase->purchase_no,
                'invoice_no' => $purchase->invoice_no,
                'purchase_date' => $purchase->purchase_date?->format('Y-m-d'),
                'subtotal' => $purchase->subtotal,
                'discount' => $purchase->discount,
                'tax' => $purchase->tax,
                'grand_total' => $purchase->grand_total,
                'notes' => $purchase->notes,
                'branch' => $purchase->branch ? [
                    'id' => $purchase->branch->id,
                    'name' => $purchase->branch->name,
                ] : null,
                'supplier' => $purchase->supplier ? [
                    'id' => $purchase->supplier->id,
                    'name' => $purchase->supplier->name,
                    'phone' => $purchase->supplier->phone,
                    'email' => $purchase->supplier->email,
                    'address' => $purchase->supplier->address,
                ] : null,
                'creator' => $purchase->creator ? [
                    'id' => $purchase->creator->id,
                    'name' => $purchase->creator->name,
                ] : null,
                'items' => $purchase->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name,
                        'sku' => $item->product?->sku,
                        'quantity' => $item->quantity,
                        'unit_cost' => $item->unit_cost,
                        'line_total' => $item->line_total,
                    ];
                })->values(),
            ],
        ]);
    }
}
