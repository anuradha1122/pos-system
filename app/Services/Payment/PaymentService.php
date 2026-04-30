<?php

namespace App\Services\Payment;

use App\Models\CompanySetting;
use App\Models\DailyClosing;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function create(array $data): Payment
    {
        $this->ensurePaymentAllowed();

        return DB::transaction(function () use ($data) {
            return Payment::create([
                'reference_type' => $data['reference_type'] ?? null,
                'reference_id' => $data['reference_id'] ?? null,
                'branch_id' => auth()->user()->branch_id,
                'type' => $data['type'],
                'amount' => $data['amount'],
                'method' => $data['method'],
                'payment_date' => $data['payment_date'] ?? now()->toDateString(),
                'note' => $data['note'] ?? null,
                'created_by' => auth()->id(),
            ]);
        });
    }

    private function ensurePaymentAllowed(): void
    {
        $settings = CompanySetting::query()->first();

        if (! $settings?->enable_daily_closing) {
            return;
        }

        $closedToday = DailyClosing::query()
            ->where('branch_id', auth()->user()->branch_id)
            ->whereDate('closing_date', now()->toDateString())
            ->where('status', 'finalized') // ← HERE
            ->exists();

        if ($closedToday) {
            throw ValidationException::withMessages([
                'payment' => 'Payments cannot be added after today has been closed.',
            ]);
        }
    }
}
