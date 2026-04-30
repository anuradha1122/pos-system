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
        Schema::table('sale_returns', function (Blueprint $table) {
            $table->decimal('refund_amount', 12, 2)->default(0)->after('total_amount');
            $table->enum('refund_method', ['cash', 'card', 'bank', 'credit'])->nullable()->after('refund_amount');
            $table->enum('refund_status', ['refunded', 'partial', 'credit', 'none'])->default('none')->after('refund_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sale_returns', function (Blueprint $table) {
            //
        });
    }
};
