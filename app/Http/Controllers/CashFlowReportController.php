<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CashFlowReportRequest;
use App\Models\Branch;
use App\Services\CashFlow\CashFlowReportService;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CashFlowExport;

class CashFlowReportController extends Controller
{
    public function __construct(
        protected CashFlowReportService $cashFlowReportService
    ) {
    }

    public function index(CashFlowReportRequest $request): Response
    {
        $filters = $request->validated();

        $report = $this->cashFlowReportService->getReport($filters);

        return Inertia::render('Reports/CashFlow', [
            'payments' => $report['payments'],
            'summary' => $report['summary'],
            'filters' => $filters,
            'branches' => Branch::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
            'methods' => ['cash', 'card', 'bank', 'credit'],
            'types' => ['in', 'out'],
        ]);
    }

    public function export(CashFlowReportRequest $request)
    {
        return Excel::download(
            new CashFlowExport($request->validated()),
            'cash-flow.xlsx'
        );
    }
}
