<?php

namespace App\Services\Brand;

use App\Models\Brand;
use Illuminate\Support\Facades\DB;

class BrandService
{
    public function create(array $data): Brand
    {
        return DB::transaction(function () use ($data) {
            return Brand::create([
                'name' => $data['name'],
                'code' => $data['code'] ?? null,
                'is_active' => $data['is_active'],
            ]);
        });
    }

    public function update(Brand $brand, array $data): Brand
    {
        return DB::transaction(function () use ($brand, $data) {
            $brand->update([
                'name' => $data['name'],
                'code' => $data['code'] ?? null,
                'is_active' => $data['is_active'],
            ]);

            return $brand->refresh();
        });
    }
}
