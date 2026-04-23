<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('short_name', 50);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique('name');
            $table->unique('short_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
