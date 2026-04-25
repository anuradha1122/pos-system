<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\BranchProductStock;
use App\Models\Customer;
use App\Models\Product;
use App\Models\PurchaseHeader;
use App\Models\SaleHeader;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = Carbon::today();
        $monthStart = Carbon::now()->startOfMonth();
        $last7DaysStart = Carbon::today()->subDays(6);

        $todaySalesAmount = DB::table('sale_items')
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->whereDate('sale_headers.sale_date', $today)
            ->sum('sale_items.line_total');

        $todaySalesCount = SaleHeader::query()
            ->whereDate('sale_date', $today)
            ->count();

        $monthSalesAmount = DB::table('sale_items')
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->whereBetween('sale_headers.sale_date', [
                $monthStart->toDateString(),
                $today->toDateString(),
            ])
            ->sum('sale_items.line_total');

        $lowStockCount = BranchProductStock::query()
            ->whereColumn('quantity', '<=', 'reorder_level')
            ->where('reorder_level', '>', 0)
            ->count();

        $salesByDayRaw = DB::table('sale_items')
            ->join('sale_headers', 'sale_items.sale_header_id', '=', 'sale_headers.id')
            ->selectRaw('DATE(sale_headers.sale_date) as sale_day, SUM(sale_items.line_total) as total_amount')
            ->whereBetween('sale_headers.sale_date', [
                $last7DaysStart->toDateString(),
                $today->toDateString(),
            ])
            ->groupByRaw('DATE(sale_headers.sale_date)')
            ->orderByRaw('DATE(sale_headers.sale_date)')
            ->get()
            ->keyBy('sale_day');

        $salesByDay = collect(range(0, 6))->map(function ($i) use ($last7DaysStart, $salesByDayRaw) {
            $date = $last7DaysStart->copy()->addDays($i)->toDateString();

            return [
                'date' => $date,
                'label' => Carbon::parse($date)->format('d M'),
                'amount' => (float) ($salesByDayRaw[$date]->total_amount ?? 0),
            ];
        })->values();

        $topSellingProducts = DB::table('sale_items')
            ->join('products', 'sale_items.product_id', '=', 'products.id')
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(sale_items.quantity) as total_qty'),
                DB::raw('SUM(sale_items.line_total) as total_amount')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $recentSaleHeaders = SaleHeader::query()
            ->with([
                'customer:id,name',
                'branch:id,name',
                'user:id,name',
            ])
            ->latest('sale_date')
            ->latest('id')
            ->limit(5)
            ->get();

        $recentSaleTotals = DB::table('sale_items')
            ->select('sale_header_id', DB::raw('SUM(line_total) as total_amount'))
            ->whereIn('sale_header_id', $recentSaleHeaders->pluck('id'))
            ->groupBy('sale_header_id')
            ->get()
            ->keyBy('sale_header_id');

        $recentSales = $recentSaleHeaders->map(function ($sale) use ($recentSaleTotals) {
            return [
                'id' => $sale->id,
                'invoice_no' => $sale->invoice_no,
                'sale_date' => $sale->sale_date,
                'customer' => $sale->customer?->name,
                'branch' => $sale->branch?->name,
                'cashier' => $sale->user?->name,
                'total_amount' => (float) ($recentSaleTotals[$sale->id]->total_amount ?? 0),
            ];
        });

        return Inertia::render('Dashboard', [
            'stats' => [
                'branches' => Branch::count(),
                'users' => User::count(),
                'roles' => Role::count(),
                'products' => Product::count(),
                'customers' => Customer::count(),
                'purchases' => PurchaseHeader::count(),
                'today_sales_amount' => (float) $todaySalesAmount,
                'today_sales_count' => $todaySalesCount,
                'month_sales_amount' => (float) $monthSalesAmount,
                'low_stock_count' => $lowStockCount,
            ],
            'salesByDay' => $salesByDay,
            'topSellingProducts' => $topSellingProducts,
            'recentSales' => $recentSales,
        ]);
    }
}
