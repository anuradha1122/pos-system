<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'address',
        'phone',
        'email',
        'logo',
        'receipt_footer',

        'invoice_prefix',
        'purchase_prefix',
        'receipt_width',
        'low_stock_threshold',

        'allow_credit_sales',
        'enable_daily_closing',
        'prevent_sale_after_closing',
        'prevent_expense_after_closing',

        'updated_by',
    ];

    protected $casts = [
        'low_stock_threshold' => 'decimal:2',
        'allow_credit_sales' => 'boolean',
        'enable_daily_closing' => 'boolean',
        'prevent_sale_after_closing' => 'boolean',
        'prevent_expense_after_closing' => 'boolean',
    ];
}
