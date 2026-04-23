<?php

namespace App\Services\Supplier;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class SupplierService
{
    public function create(array $data): Supplier
    {
        return DB::transaction(function () use ($data) {
            return Supplier::create($this->payload($data));
        });
    }

    public function update(Supplier $supplier, array $data): Supplier
    {
        return DB::transaction(function () use ($supplier, $data) {
            $supplier->update($this->payload($data));
            return $supplier->fresh();
        });
    }

    public function toggleStatus(Supplier $supplier): Supplier
    {
        return DB::transaction(function () use ($supplier) {
            $supplier->update([
                'is_active' => ! $supplier->is_active,
            ]);

            return $supplier->fresh();
        });
    }

    protected function payload(array $data): array
    {
        return [
            'name' => trim($data['name']),
            'company_name' => $data['company_name'] ? trim($data['company_name']) : null,
            'phone' => trim($data['phone']),
            'email' => $data['email'] ? trim($data['email']) : null,
            'address' => $data['address'] ? trim($data['address']) : null,
            'is_active' => (bool) $data['is_active'],
        ];
    }
}
