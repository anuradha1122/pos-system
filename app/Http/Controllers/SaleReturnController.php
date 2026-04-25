<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleReturnRequest;
use App\Models\SaleHeader;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Services\Sale\SaleReturnService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SaleReturnController extends Controller
{
    public function __construct(
        protected SaleReturnService $saleReturnService
    ) {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $returns = SaleReturn::query()
            ->with([
                'sale:id,invoice_no',
                'branch:id,name',
                'customer:id,name',
                'creator:id,name',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where('return_no', 'like', "%{$search}%")
                    ->orWhereHas('sale', function ($q) use ($search) {
                        $q->where('invoice_no', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SaleReturns/Index', [
            'returns' => $returns,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $saleId = $request->integer('sale_header_id');

        $sales = SaleHeader::query()
            ->with(['customer:id,name', 'branch:id,name'])
            ->latest()
            ->limit(50)
            ->get(['id', 'invoice_no', 'sale_date', 'customer_id', 'branch_id', 'grand_total']);

        $selectedSale = null;

        if ($saleId) {
            $sale = SaleHeader::query()
                ->with(['customer:id,name', 'branch:id,name', 'items.product:id,name,sku'])
                ->find($saleId);

            if ($sale) {
                $returnedQtyBySaleItem = SaleReturnItem::query()
                    ->whereIn('sale_item_id', $sale->items->pluck('id'))
                    ->selectRaw('sale_item_id, SUM(quantity) as returned_qty')
                    ->groupBy('sale_item_id')
                    ->get()
                    ->keyBy('sale_item_id');

                $selectedSale = [
                    'id' => $sale->id,
                    'invoice_no' => $sale->invoice_no,
                    'sale_date' => $sale->sale_date,
                    'customer' => $sale->customer?->name,
                    'branch' => $sale->branch?->name,
                    'items' => $sale->items->map(function ($item) use ($returnedQtyBySaleItem) {
                        $returnedQty = (float) ($returnedQtyBySaleItem[$item->id]->returned_qty ?? 0);
                        $availableQty = (float) $item->quantity - $returnedQty;

                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $item->product?->name,
                            'sku' => $item->product?->sku,
                            'sold_qty' => (float) $item->quantity,
                            'returned_qty' => $returnedQty,
                            'available_qty' => $availableQty,
                            'unit_price' => (float) $item->unit_price,
                            'line_total' => (float) $item->line_total,
                        ];
                    })->values(),
                ];
            }
        }

        return Inertia::render('SaleReturns/Create', [
            'sales' => $sales,
            'selectedSale' => $selectedSale,
            'filters' => [
                'sale_header_id' => $saleId,
            ],
        ]);
    }

    public function store(StoreSaleReturnRequest $request)
    {
        $saleReturn = $this->saleReturnService->create($request->validated());

        return redirect()
            ->route('sale-returns.show', $saleReturn->id)
            ->with('success', 'Sale return created successfully.');
    }

    public function show(SaleReturn $saleReturn): Response
    {
        $saleReturn->load([
            'sale:id,invoice_no,sale_date,grand_total',
            'branch:id,name',
            'customer:id,name',
            'creator:id,name',
            'items.product:id,name,sku',
        ]);

        return Inertia::render('SaleReturns/Show', [
            'saleReturn' => $saleReturn,
        ]);
    }
}
