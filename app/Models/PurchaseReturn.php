<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseReturn extends Model
{
    protected $fillable = [
        'purchase_header_id',
        'branch_id',
        'supplier_id',
        'return_date',
        'total_amount',
        'reason',
        'created_by',
    ];

    public function purchase()
    {
        return $this->belongsTo(PurchaseHeader::class, 'purchase_header_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseReturnItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
