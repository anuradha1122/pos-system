<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {

            if (!Schema::hasColumn('purchase_headers', 'subtotal')) {
                $table->decimal('subtotal', 15, 2)->default(0)->after('invoice_no');
            }

            if (!Schema::hasColumn('purchase_headers', 'discount')) {
                $table->decimal('discount', 15, 2)->default(0)->after('subtotal');
            }

            if (!Schema::hasColumn('purchase_headers', 'tax')) {
                $table->decimal('tax', 15, 2)->default(0)->after('discount');
            }

            if (!Schema::hasColumn('purchase_headers', 'grand_total')) {
                $table->decimal('grand_total', 15, 2)->default(0)->after('tax');
            }

            if (!Schema::hasColumn('purchase_headers', 'notes')) {
                $table->text('notes')->nullable()->after('grand_total');
            }

            // Optional cleanup (only if exists)
            if (Schema::hasColumn('purchase_headers', 'total_amount')) {
                $table->dropColumn('total_amount');
            }
        });
    }

    public function down(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {
            //
        });
    }
};
