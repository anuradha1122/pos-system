<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Branch;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        Branch::firstOrCreate([
            'code' => 'MAIN'
        ], [
            'name' => 'Main Branch',
            'phone' => '0710000000',
            'email' => 'main@pos.com',
            'address' => 'Main Street',
            'is_active' => true,
        ]);

        Branch::firstOrCreate([
            'code' => 'BR001'
        ], [
            'name' => 'Branch 1',
            'phone' => '0720000000',
            'email' => 'branch1@pos.com',
            'address' => 'Branch 1 Location',
            'is_active' => true,
        ]);
    }
}
