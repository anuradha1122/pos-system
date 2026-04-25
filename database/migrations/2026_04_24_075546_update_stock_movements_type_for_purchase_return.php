<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE stock_movements MODIFY type ENUM(
            'purchase',
            'sale',
            'adjustment_in',
            'adjustment_out',
            'sale_return',
            'purchase_return'
        ) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE stock_movements MODIFY type ENUM(
            'purchase',
            'sale',
            'adjustment_in',
            'adjustment_out',
            'sale_return'
        ) NOT NULL");
    }
};
