<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Payment;

class SaleHeader extends Model
{
    protected $fillable = [
        'invoice_no',
        'branch_id',
        'customer_id',
        'sale_date',
        'subtotal',
        'discount',
        'tax',
        'grand_total',
        'notes',
        'paid_amount',
        'balance_amount',
        'payment_status',
        'created_by',
    ];

    protected $casts = [
        'sale_date' => 'date',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'tax' => 'decimal:2',
        'grand_total' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class, 'sale_header_id');
    }

    public function returns(): HasMany
    {
        return $this->hasMany(SaleReturn::class, 'sale_header_id');
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function payments(): MorphMany
    {
        return $this->morphMany(Payment::class, 'reference');
    }
}
