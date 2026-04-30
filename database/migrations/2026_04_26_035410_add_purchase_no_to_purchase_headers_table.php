<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {
            if (!Schema::hasColumn('purchase_headers', 'purchase_no')) {
                $table->string('purchase_no')->nullable()->after('id');
            }
        });

        DB::table('purchase_headers')
            ->whereNull('purchase_no')
            ->orderBy('id')
            ->get()
            ->each(function ($purchase) {
                DB::table('purchase_headers')
                    ->where('id', $purchase->id)
                    ->update([
                        'purchase_no' => 'PUR-' . str_pad($purchase->id, 6, '0', STR_PAD_LEFT),
                    ]);
            });

        Schema::table('purchase_headers', function (Blueprint $table) {
            $table->string('purchase_no')->nullable(false)->unique()->change();
        });
    }

    public function down(): void
    {
        Schema::table('purchase_headers', function (Blueprint $table) {
            if (Schema::hasColumn('purchase_headers', 'purchase_no')) {
                $table->dropUnique(['purchase_no']);
                $table->dropColumn('purchase_no');
            }
        });
    }
};
