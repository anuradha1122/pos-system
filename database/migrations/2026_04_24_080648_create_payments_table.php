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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->string('reference_type');
            $table->unsignedBigInteger('reference_id');

            $table->foreignId('branch_id')->constrained()->cascadeOnDelete();

            $table->enum('type', ['in', 'out']);
            $table->decimal('amount', 12, 2);

            $table->enum('method', ['cash', 'card', 'bank', 'credit']);

            $table->text('note')->nullable();

            $table->foreignId('created_by')->constrained('users');

            $table->timestamps();

            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
