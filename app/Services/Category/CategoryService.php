<?php

namespace App\Services\Category;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    public function create(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            return Category::create([
                'name' => $data['name'],
                'code' => $data['code'] ?? null,
                'is_active' => $data['is_active'],
            ]);
        });
    }

    public function update(Category $category, array $data): Category
    {
        return DB::transaction(function () use ($category, $data) {
            $category->update([
                'name' => $data['name'],
                'code' => $data['code'] ?? null,
                'is_active' => $data['is_active'],
            ]);

            return $category->refresh();
        });
    }
}
