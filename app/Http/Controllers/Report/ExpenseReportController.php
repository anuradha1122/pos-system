<?php

namespace App\Http\Controllers\Report;

use App\Exports\ExpenseReportExport;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExpenseReportController extends Controller
{
    public function index(Request $request): Response
    {
        $from = $request->input('from');
        $to = $request->input('to');
        $category = $request->input('category');
        $method = $request->input('method');

        $baseQuery = Expense::query()
            ->with(['branch:id,name', 'creator:id,name'])
            ->where('branch_id', auth()->user()->branch_id)
            ->when($from, function ($query) use ($from) {
                $query->whereDate('expense_date', '>=', $from);
            })
            ->when($to, function ($query) use ($to) {
                $query->whereDate('expense_date', '<=', $to);
            })
            ->when($category, function ($query) use ($category) {
                $query->where('category', $category);
            })
            ->when($method, function ($query) use ($method) {
                $query->where('method', $method);
            });

        $expenses = (clone $baseQuery)
            ->latest('expense_date')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        $totalExpense = (clone $baseQuery)->sum('amount');

        $categoryTotals = (clone $baseQuery)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->orderByDesc('total')
            ->get();

        $methodTotals = (clone $baseQuery)
            ->selectRaw('method, SUM(amount) as total')
            ->groupBy('method')
            ->orderByDesc('total')
            ->get();

        return Inertia::render('Reports/ExpenseReport', [
            'expenses' => $expenses,
            'summary' => [
                'total_expense' => (float) $totalExpense,
            ],
            'categoryTotals' => $categoryTotals,
            'methodTotals' => $methodTotals,
            'filters' => [
                'from' => $from,
                'to' => $to,
                'category' => $category,
                'method' => $method,
            ],
            'categories' => [
                'Rent',
                'Salary',
                'Electricity',
                'Water',
                'Internet',
                'Transport',
                'Maintenance',
                'Other',
            ],
            'methods' => [
                'cash',
                'card',
                'bank',
                'credit',
            ],
        ]);
    }

    public function export(Request $request): BinaryFileResponse
    {
        $fileName = 'expense-report-' . now()->format('Y-m-d-H-i-s') . '.xlsx';

        return Excel::download(
            new ExpenseReportExport(
                $request->input('from'),
                $request->input('to'),
                $request->input('category'),
                $request->input('method'),
            ),
            $fileName
        );
    }
}
