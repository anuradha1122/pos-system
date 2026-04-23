<?php

namespace App\Services\Unit;

use App\Models\Unit;
use Illuminate\Support\Facades\DB;

class UnitService
{
    public function create(array $data): Unit
    {
        return DB::transaction(function () use ($data) {
            return Unit::create([
                'name' => $data['name'],
                'short_name' => $data['short_name'],
                'is_active' => $data['is_active'],
            ]);
        });
    }

    public function update(Unit $unit, array $data): Unit
    {
        return DB::transaction(function () use ($unit, $data) {
            $unit->update([
                'name' => $data['name'],
                'short_name' => $data['short_name'],
                'is_active' => $data['is_active'],
            ]);

            return $unit->refresh();
        });
    }
}
