<?php

namespace App\Services\Customer;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerService
{
    public function create(array $data): Customer
    {
        return DB::transaction(function () use ($data) {
            return Customer::create($data);
        });
    }

    public function update(Customer $customer, array $data): Customer
    {
        return DB::transaction(function () use ($customer, $data) {
            $customer->update($data);
            return $customer->refresh();
        });
    }
}
