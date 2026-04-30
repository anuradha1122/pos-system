<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfitByProductReportRequest;
use App\Models\Branch;
use App\Models\Brand;
use App\Models\Category;
use App\Services\Reports\ProfitByProductReportService;
use Inertia\Inertia;
use Inertia\Response;
use App\Exports\ProfitByProductExport;
use Maatwebsite\Excel\Facades\Excel;

class ProfitByProductReportController extends Controller
{
    public function __construct(
        protected ProfitByProductReportService $profitByProductReportService
    ) {
    }

    public function index(ProfitByProductReportRequest $request): Response
    {
        $filters = $request->validated();

        $report = $this->profitByProductReportService->getReport($filters);

        return Inertia::render('Reports/ProfitByProduct', [
            'rows' => $report['rows'],
            'summary' => $report['summary'],
            'filters' => $filters,
            'branches' => Branch::query()->select('id', 'name')->orderBy('name')->get(),
            'categories' => Category::query()->select('id', 'name')->orderBy('name')->get(),
            'brands' => Brand::query()->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    public function export(ProfitByProductReportRequest $request)
    {
        return Excel::download(
            new ProfitByProductExport($request->validated()),
            'profit-by-product.xlsx'
        );
    }
}
