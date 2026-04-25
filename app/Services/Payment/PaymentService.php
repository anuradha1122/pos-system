<?php

namespace App\Services\Payment;

use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function create(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            return Payment::create([
                'reference_type' => $data['reference_type'],
                'reference_id' => $data['reference_id'],
                'branch_id' => $data['branch_id'],
                'type' => $data['type'],
                'amount' => $data['amount'],
                'method' => $data['method'],
                'note' => $data['note'] ?? null,
                'created_by' => Auth::id(),
            ]);
        });
    }
}
