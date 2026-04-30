<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyClosing extends Model
{
    protected $fillable = [
        'branch_id',
        'closing_date',
        'opening_balance',
        'cash_in',
        'cash_out',
        'expected_cash',
        'counted_cash',
        'variance',
        'status',
        'finalized_at',
        'finalized_by',
        'note',
        'created_by',
    ];

    protected $casts = [
        'closing_date' => 'date',
        'opening_balance' => 'decimal:2',
        'cash_in' => 'decimal:2',
        'cash_out' => 'decimal:2',
        'expected_cash' => 'decimal:2',
        'counted_cash' => 'decimal:2',
        'variance' => 'decimal:2',
        'finalized_at' => 'datetime',
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function finalizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'finalized_by');
    }

    public function isFinalized(): bool
    {
        return $this->status === 'finalized';
    }
}
