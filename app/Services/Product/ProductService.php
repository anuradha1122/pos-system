<?php

namespace App\Services\Product;

use App\Models\Product;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function create(array $data): Product
    {
        return DB::transaction(function () use ($data) {
            return Product::create($this->payload($data));
        });
    }

    public function update(Product $product, array $data): Product
    {
        return DB::transaction(function () use ($product, $data) {
            $product->update($this->payload($data));

            return $product->fresh(['category', 'brand', 'unit']);
        });
    }

    public function toggleStatus(Product $product): Product
    {
        return DB::transaction(function () use ($product) {
            $product->update([
                'is_active' => ! $product->is_active,
            ]);

            return $product->fresh();
        });
    }

    protected function payload(array $data): array
    {
        return [
            'category_id' => $data['category_id'],
            'brand_id' => $data['brand_id'] ?? null,
            'unit_id' => $data['unit_id'],
            'name' => trim($data['name']),
            'sku' => trim($data['sku']),
            'barcode' => $data['barcode'] ? trim($data['barcode']) : null,
            'description' => $data['description'] ? trim($data['description']) : null,
            'cost_price' => $data['cost_price'],
            'selling_price' => $data['selling_price'],
            'reorder_level' => $data['reorder_level'],
            'is_active' => (bool) $data['is_active'],
        ];
    }
}
