<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_settings', function (Blueprint $table) {
            $table->string('invoice_prefix')->default('INV')->after('receipt_footer');
            $table->string('purchase_prefix')->default('PUR')->after('invoice_prefix');
            $table->string('receipt_width')->default('80mm')->after('purchase_prefix');

            $table->decimal('low_stock_threshold', 12, 2)->default(5)->after('receipt_width');

            $table->boolean('allow_credit_sales')->default(true)->after('low_stock_threshold');
            $table->boolean('enable_daily_closing')->default(true)->after('allow_credit_sales');
            $table->boolean('prevent_sale_after_closing')->default(false)->after('enable_daily_closing');
            $table->boolean('prevent_expense_after_closing')->default(false)->after('prevent_sale_after_closing');

            $table->foreignId('updated_by')->nullable()->after('prevent_expense_after_closing')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('company_settings', function (Blueprint $table) {
            $table->dropConstrainedForeignId('updated_by');

            $table->dropColumn([
                'invoice_prefix',
                'purchase_prefix',
                'receipt_width',
                'low_stock_threshold',
                'allow_credit_sales',
                'enable_daily_closing',
                'prevent_sale_after_closing',
                'prevent_expense_after_closing',
            ]);
        });
    }
};
