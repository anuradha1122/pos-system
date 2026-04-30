<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('daily_closings', function (Blueprint $table) {
            $table->string('status')->default('draft')->after('variance');
            $table->timestamp('finalized_at')->nullable()->after('status');
            $table->foreignId('finalized_by')
                ->nullable()
                ->after('finalized_at')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('daily_closings', function (Blueprint $table) {
            $table->dropForeign(['finalized_by']);
            $table->dropColumn(['status', 'finalized_at', 'finalized_by']);
        });
    }
};
