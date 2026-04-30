<?php

namespace App\Services\Expense;

use App\Models\CompanySetting;
use App\Models\DailyClosing;
use App\Models\Expense;
use App\Models\Payment;
use App\Services\AuditLog\AuditLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ExpenseService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {
    }

    public function create(array $data): Expense
    {
        return DB::transaction(function () use ($data) {
            $this->ensureExpenseAllowedForDate($data['expense_date']);

            $expense = Expense::create([
                'branch_id' => Auth::user()->branch_id,
                'expense_date' => $data['expense_date'],
                'category' => $data['category'],
                'amount' => $data['amount'],
                'method' => $data['method'],
                'note' => $data['note'] ?? null,
                'created_by' => Auth::id(),
            ]);

            Payment::create([
                'branch_id' => Auth::user()->branch_id,
                'reference_type' => 'expense',
                'reference_id' => $expense->id,
                'type' => 'out',
                'amount' => $expense->amount,
                'method' => $expense->method,
                'payment_date' => $expense->expense_date,
                'note' => $expense->note,
                'created_by' => Auth::id(),
            ]);

            $this->auditLogService->log(
                action: 'created',
                module: 'expense',
                auditable: $expense,
                oldValues: null,
                newValues: $expense->fresh()->toArray()
            );

            return $expense;
        });
    }

    public function update(Expense $expense, array $data): Expense
    {
        return DB::transaction(function () use ($expense, $data) {
            $this->ensureExpenseAllowedForDate($data['expense_date']);

            $oldValues = $expense->toArray();

            $expense->update([
                'expense_date' => $data['expense_date'],
                'category' => $data['category'],
                'amount' => $data['amount'],
                'method' => $data['method'],
                'note' => $data['note'] ?? null,
            ]);

            Payment::where('reference_type', 'expense')
                ->where('reference_id', $expense->id)
                ->update([
                    'amount' => $expense->amount,
                    'method' => $expense->method,
                    'payment_date' => $expense->expense_date,
                    'note' => $expense->note,
                ]);

            $expense->refresh();

            $this->auditLogService->log(
                action: 'updated',
                module: 'expense',
                auditable: $expense,
                oldValues: $oldValues,
                newValues: $expense->toArray()
            );

            return $expense;
        });
    }

    protected function ensureExpenseAllowedForDate(string $date): void
    {
        $branchId = Auth::user()->branch_id;

        if (!$branchId) {
            throw ValidationException::withMessages([
                'branch_id' => 'Authenticated user is not assigned to a branch.',
            ]);
        }

        $setting = CompanySetting::first();

        if (!$setting?->prevent_expense_after_closing) {
            return;
        }

        $isClosed = DailyClosing::query()
            ->where('branch_id', $branchId)
            ->whereDate('closing_date', $date)
            ->where('status', 'finalized')
            ->exists();

        if ($isClosed) {
            throw ValidationException::withMessages([
                'expense_date' => 'Expenses are blocked because daily closing is finalized for this date.',
            ]);
        }
    }
}
