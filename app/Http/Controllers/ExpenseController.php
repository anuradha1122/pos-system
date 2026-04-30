<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Services\Expense\ExpenseService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseController extends Controller
{
    public function __construct(
        protected ExpenseService $expenseService
    ) {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $expenses = Expense::query()
            ->with(['branch:id,name', 'creator:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->where('category', 'like', "%{$search}%")
                    ->orWhere('method', 'like', "%{$search}%")
                    ->orWhere('note', 'like', "%{$search}%");
            })
            ->latest('expense_date')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Expenses/Create');
    }

    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        $this->expenseService->create($request->validated());

        return redirect()
            ->route('expenses.index')
            ->with('success', 'Expense created successfully.');
    }

    public function edit(Expense $expense): Response
    {
        return Inertia::render('Expenses/Edit', [
            'expense' => $expense,
        ]);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        $this->expenseService->update($expense, $request->validated());

        return redirect()
            ->route('expenses.index')
            ->with('success', 'Expense updated successfully.');
    }
}
