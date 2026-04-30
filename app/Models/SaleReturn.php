<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SaleReturn extends Model
{
    protected $fillable = [
        'return_no',
        'sale_header_id',
        'branch_id',
        'customer_id',
        'return_date',
        'subtotal',
        'total_amount',
        'reason',
        'refund_amount',
        'refund_method',
        'refund_status',
        'created_by',
    ];

    public function sale(): BelongsTo
    {
        return $this->belongsTo(SaleHeader::class, 'sale_header_id');
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

    public function items(): HasMany
    {
        return $this->hasMany(SaleReturnItem::class);
    }
}
