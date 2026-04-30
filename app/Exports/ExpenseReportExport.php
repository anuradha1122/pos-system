<?php

namespace App\Exports;

use App\Models\Expense;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class ExpenseReportExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    public function __construct(
        protected ?string $from = null,
        protected ?string $to = null,
        protected ?string $category = null,
        protected ?string $method = null,
    ) {
    }

    public function query(): Builder
    {
        return Expense::query()
            ->with(['branch:id,name', 'creator:id,name'])
            ->where('branch_id', Auth::user()->branch_id)
            ->when($this->from, function ($query) {
                $query->whereDate('expense_date', '>=', $this->from);
            })
            ->when($this->to, function ($query) {
                $query->whereDate('expense_date', '<=', $this->to);
            })
            ->when($this->category, function ($query) {
                $query->where('category', $this->category);
            })
            ->when($this->method, function ($query) {
                $query->where('method', $this->method);
            })
            ->latest('expense_date')
            ->latest('id');
    }

    public function headings(): array
    {
        return [
            'Date',
            'Branch',
            'Category',
            'Method',
            'Amount',
            'Note',
            'Created By',
        ];
    }

    public function map($expense): array
    {
        return [
            optional($expense->expense_date)->format('Y-m-d'),
            $expense->branch?->name,
            $expense->category,
            ucfirst($expense->method),
            (float) $expense->amount,
            $expense->note,
            $expense->creator?->name,
        ];
    }
}
