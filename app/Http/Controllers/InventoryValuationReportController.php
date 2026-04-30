<?php

namespace App\Http\Controllers;

use App\Http\Requests\InventoryValuationReportRequest;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Category;
use App\Services\Reports\InventoryValuationReportService;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\InventoryValuationExport;

class InventoryValuationReportController extends Controller
{
    public function __construct(
        protected InventoryValuationReportService $inventoryValuationReportService
    ) {
    }

    public function index(InventoryValuationReportRequest $request): Response
    {
        $filters = $request->validated();

        $report = $this->inventoryValuationReportService->getReport($filters);

        return Inertia::render('Reports/InventoryValuation', [
            'stocks' => $report['stocks'],
            'summary' => $report['summary'],
            'filters' => $filters,
            'branches' => Branch::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'categories' => Category::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'brands' => Brand::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function export(InventoryValuationReportRequest $request)
    {
        return Excel::download(
            new InventoryValuationExport($request->validated()),
            'inventory-valuation.xlsx'
        );
    }
}
