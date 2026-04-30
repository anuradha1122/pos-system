<?php

namespace App\Services\DailyClosing;

use App\Models\DailyClosing;
use App\Models\Payment;
use App\Services\AuditLog\AuditLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DailyClosingService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {
    }

    public function calculate(string $date, float $openingBalance, float $countedCash = 0): array
    {
        $branchId = Auth::user()->branch_id;

        if (!$branchId) {
            throw ValidationException::withMessages([
                'branch_id' => 'Current user does not have a branch assigned.',
            ]);
        }

        $cashIn = Payment::query()
            ->where('branch_id', $branchId)
            ->where('method', 'cash')
            ->where('type', 'in')
            ->whereDate('payment_date', $date)
            ->sum('amount');

        $cashOut = Payment::query()
            ->where('branch_id', $branchId)
            ->where('method', 'cash')
            ->where('type', 'out')
            ->whereDate('payment_date', $date)
            ->sum('amount');

        $expectedCash = $openingBalance + (float) $cashIn - (float) $cashOut;
        $variance = $countedCash - $expectedCash;

        return [
            'cash_in' => (float) $cashIn,
            'cash_out' => (float) $cashOut,
            'expected_cash' => (float) $expectedCash,
            'variance' => (float) $variance,
        ];
    }

    public function create(array $data): DailyClosing
    {
        return DB::transaction(function () use ($data) {
            $branchId = Auth::user()->branch_id;

            if (!$branchId) {
                throw ValidationException::withMessages([
                    'branch_id' => 'Current user does not have a branch assigned.',
                ]);
            }

            $exists = DailyClosing::query()
                ->where('branch_id', $branchId)
                ->whereDate('closing_date', $data['closing_date'])
                ->exists();

            if ($exists) {
                throw ValidationException::withMessages([
                    'closing_date' => 'Daily closing already exists for this date.',
                ]);
            }

            $openingBalance = (float) $data['opening_balance'];
            $countedCash = (float) $data['counted_cash'];

            $calculated = $this->calculate(
                $data['closing_date'],
                $openingBalance,
                $countedCash
            );

            $closing = DailyClosing::create([
                'branch_id' => $branchId,
                'closing_date' => $data['closing_date'],
                'opening_balance' => $openingBalance,
                'cash_in' => $calculated['cash_in'],
                'cash_out' => $calculated['cash_out'],
                'expected_cash' => $calculated['expected_cash'],
                'counted_cash' => $countedCash,
                'variance' => $calculated['variance'],
                'status' => 'draft',
                'note' => $data['note'] ?? null,
                'created_by' => Auth::id(),
            ]);

            $this->auditLogService->log(
                action: 'created',
                module: 'daily-closing',
                auditable: $closing,
                oldValues: null,
                newValues: $closing->fresh()->toArray()
            );

            return $closing;
        });
    }

    public function update(DailyClosing $closing, array $data): DailyClosing
    {
        return DB::transaction(function () use ($closing, $data) {
            if ($closing->isFinalized()) {
                throw ValidationException::withMessages([
                    'closing' => 'Finalized daily closing cannot be edited.',
                ]);
            }

            $oldValues = $closing->toArray();

            $openingBalance = (float) $data['opening_balance'];
            $countedCash = (float) $data['counted_cash'];

            $calculated = $this->calculate(
                $data['closing_date'],
                $openingBalance,
                $countedCash
            );

            $closing->update([
                'closing_date' => $data['closing_date'],
                'opening_balance' => $openingBalance,
                'cash_in' => $calculated['cash_in'],
                'cash_out' => $calculated['cash_out'],
                'expected_cash' => $calculated['expected_cash'],
                'counted_cash' => $countedCash,
                'variance' => $calculated['variance'],
                'note' => $data['note'] ?? null,
            ]);

            $closing->refresh();

            $this->auditLogService->log(
                action: 'updated',
                module: 'daily-closing',
                auditable: $closing,
                oldValues: $oldValues,
                newValues: $closing->toArray()
            );

            return $closing;
        });
    }

    public function finalize(DailyClosing $closing): DailyClosing
    {
        return DB::transaction(function () use ($closing) {
            if ($closing->isFinalized()) {
                throw ValidationException::withMessages([
                    'closing' => 'Daily closing is already finalized.',
                ]);
            }

            $oldValues = $closing->toArray();

            $closing->update([
                'status' => 'finalized',
                'finalized_at' => now(),
                'finalized_by' => Auth::id(),
            ]);

            $closing->refresh();

            $this->auditLogService->log(
                action: 'finalized',
                module: 'daily-closing',
                auditable: $closing,
                oldValues: $oldValues,
                newValues: $closing->toArray()
            );

            return $closing;
        });
    }
}
