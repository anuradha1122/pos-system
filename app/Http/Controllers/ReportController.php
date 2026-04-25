<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\SaleHeader;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Exports\ProfitReportExport;
use App\Exports\SalesReportExport;
use App\Exports\StockMovementReportExport;
use App\Exports\LowStockReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;

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

    public function profit(Request $request): Response
    {
        $from = $request->string('from')->toString();
        $to = $request->string('to')->toString();
        $branchId = $request->string('branch_id')->toString();
        $customerId = $request->string('customer_id')->toString();
        $productId = $request->string('product_id')->toString();

        $baseQuery = DB::table('sale_items')
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->leftJoin('customers', 'sale_headers.customer_id', '=', 'customers.id')
            ->join('branches', 'sale_headers.branch_id', '=', 'branches.id')
            ->when($from, fn ($q) => $q->whereDate('sale_headers.sale_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('sale_headers.sale_date', '<=', $to))
            ->when($branchId, fn ($q) => $q->where('sale_headers.branch_id', $branchId))
            ->when($customerId, fn ($q) => $q->where('sale_headers.customer_id', $customerId))
            ->when($productId, fn ($q) => $q->where('sale_items.product_id', $productId));

        $rows = (clone $baseQuery)
            ->select([
                'sale_headers.id as sale_id',
                'sale_headers.invoice_no',
                'sale_headers.sale_date',
                'branches.name as branch_name',
                'customers.name as customer_name',
                'products.name as product_name',
                'sale_items.quantity',
                'sale_items.unit_price',
                'sale_items.cost_price',
                'sale_items.line_total',
                DB::raw('(sale_items.quantity * sale_items.cost_price) as total_cost'),
                DB::raw('(sale_items.line_total - (sale_items.quantity * sale_items.cost_price)) as profit'),
            ])
            ->orderByDesc('sale_headers.sale_date')
            ->orderByDesc('sale_headers.id')
            ->paginate(15)
            ->withQueryString();

        $summary = (clone $baseQuery)
            ->selectRaw('
                SUM(sale_items.line_total) as sales_amount,
                SUM(sale_items.quantity * sale_items.cost_price) as cost_amount,
                SUM(sale_items.line_total - (sale_items.quantity * sale_items.cost_price)) as profit_amount,
                SUM(sale_items.quantity) as total_qty
            ')
            ->first();

        return Inertia::render('Reports/ProfitReport', [
            'filters' => [
                'from' => $from,
                'to' => $to,
                'branch_id' => $branchId,
                'customer_id' => $customerId,
                'product_id' => $productId,
            ],
            'reportRows' => $rows,
            'summary' => [
                'sales_amount' => (float) ($summary->sales_amount ?? 0),
                'cost_amount' => (float) ($summary->cost_amount ?? 0),
                'profit_amount' => (float) ($summary->profit_amount ?? 0),
                'total_qty' => (float) ($summary->total_qty ?? 0),
            ],
            'branches' => Branch::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'customers' => Customer::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'products' => Product::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function profitExport(Request $request)
    {
        $filters = $request->only([
            'from',
            'to',
            'branch_id',
            'customer_id',
            'product_id',
        ]);

        $fileName = 'profit-report-' . Carbon::now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new ProfitReportExport($filters), $fileName);
    }

    public function salesExport(Request $request)
    {
        $filters = $request->only([
            'date_from',
            'date_to',
            'customer_id',
            'branch_id',
        ]);

        $fileName = 'sales-report-' . Carbon::now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new SalesReportExport($filters), $fileName);
    }

    public function stockMovementsExport(Request $request)
    {
        $filters = $request->only([
            'date_from',
            'date_to',
            'branch_id',
            'product_id',
            'type',
        ]);

        $fileName = 'stock-movement-report-' . Carbon::now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new StockMovementReportExport($filters), $fileName);
    }

    public function lowStockExport(Request $request)
    {
        $filters = $request->only([
            'search',
            'branch_id',
            'only_low',
        ]);

        $fileName = 'low-stock-report-' . Carbon::now()->format('Y-m-d') . '.xlsx';

        return Excel::download(new LowStockReportExport($filters), $fileName);
    }
}
