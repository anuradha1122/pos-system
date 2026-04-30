<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Customer;
use App\Models\SaleHeader;
use App\Models\BranchProductStock;
use App\Services\Sale\SaleService;
use App\Services\Sale\SaleDocumentService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SaleController extends Controller
{
    public function __construct(
        protected SaleService $saleService,
        protected SaleDocumentService $saleDocumentService
    ) {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $date = $request->string('date')->toString();
        $customerId = $request->string('customer_id')->toString();

        $sales = SaleHeader::query()
            ->with([
                'customer:id,name,phone',
                'branch:id,name',
                'creator:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where('invoice_no', 'like', "%{$search}%");
            })
            ->when($date, function ($query) use ($date) {
                $query->whereDate('sale_date', $date);
            })
            ->when($customerId, function ($query) use ($customerId) {
                $query->where('customer_id', $customerId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($sale) {
                return [
                    'id' => $sale->id,
                    'invoice_no' => $sale->invoice_no,
                    'sale_date' => $sale->sale_date?->format('Y-m-d'),
                    'customer' => $sale->customer ? [
                        'id' => $sale->customer->id,
                        'name' => $sale->customer->name,
                        'phone' => $sale->customer->phone,
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

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'customers' => $customers,
            'filters' => [
                'search' => $search,
                'date' => $date,
                'customer_id' => $customerId,
            ],
        ]);
    }

    public function create()
    {
        $branchId = auth()->user()->branch_id;

        $products = \App\Models\BranchProductStock::query()
            ->with('product:id,name,sku,selling_price,is_active')
            ->where('branch_id', $branchId)
            ->where('quantity', '>', 0)
            ->whereHas('product', function ($query) {
                $query->where('is_active', true);
            })
            ->get()
            ->map(function ($stock) {
                return [
                    'product_id' => $stock->product_id,
                    'name' => $stock->product?->name,
                    'sku' => $stock->product?->sku,
                    'selling_price' => $stock->product?->selling_price,
                    'available_qty' => $stock->quantity,
                ];
            })
            ->values();

        return \Inertia\Inertia::render('Sales/Create', [
            'customers' => \App\Models\Customer::query()
                ->select('id', 'name', 'phone')
                ->orderBy('name')
                ->get(),

            'products' => $products,
        ]);
    }

    public function store(StoreSaleRequest $request): RedirectResponse
    {
        $sale = $this->saleService->create($request->validated());

        return redirect()
            ->route('sales.thermal-receipt', $sale->id)
            ->with('success', 'Sale completed successfully.');
    }

    public function thermal(int $sale): Response
    {
        $saleData = $this->saleDocumentService->getSaleForDocument($sale);

        return Inertia::render('Sales/ThermalReceipt', [
            'sale' => $saleData,
            'totals' => $this->saleDocumentService->buildTotals($saleData),
            'company' => $this->saleDocumentService->getCompany(),
        ]);
    }

    public function show(SaleHeader $sale): Response
    {
        $sale->load([
            'items.product:id,name,sku',
            'customer:id,name,phone,email,address',
            'branch:id,name',
            'creator:id,name',
        ]);

        return Inertia::render('Sales/Show', [
            'sale' => [
                'id' => $sale->id,
                'invoice_no' => $sale->invoice_no,
                'sale_date' => $sale->sale_date?->format('Y-m-d'),
                'subtotal' => $sale->subtotal,
                'discount' => $sale->discount,
                'tax' => $sale->tax,
                'grand_total' => $sale->grand_total,
                'notes' => $sale->notes,
                'branch' => $sale->branch ? [
                    'id' => $sale->branch->id,
                    'name' => $sale->branch->name,
                ] : null,
                'customer' => $sale->customer ? [
                    'id' => $sale->customer->id,
                    'name' => $sale->customer->name,
                    'phone' => $sale->customer->phone,
                    'email' => $sale->customer->email,
                    'address' => $sale->customer->address,
                ] : null,
                'creator' => $sale->creator ? [
                    'id' => $sale->creator->id,
                    'name' => $sale->creator->name,
                ] : null,
                'items' => $sale->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name,
                        'sku' => $item->product?->sku,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'line_total' => $item->line_total,
                    ];
                })->values(),
            ],
        ]);
    }
}
