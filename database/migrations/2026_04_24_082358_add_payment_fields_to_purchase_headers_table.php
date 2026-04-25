<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {
            $table->decimal('paid_amount', 12, 2)->default(0)->after('total_amount');
            $table->decimal('balance_amount', 12, 2)->default(0)->after('paid_amount');
            $table->enum('payment_status', ['paid', 'partial', 'credit'])->default('credit')->after('balance_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {
            //
        });
    }
};
