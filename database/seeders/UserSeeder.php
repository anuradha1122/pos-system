<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Branch;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $mainBranch = Branch::where('code', 'MAIN')->first();

        /*
        |--------------------------------------------------------------------------
        | Super Admin
        |--------------------------------------------------------------------------
        */
        $superAdmin = User::firstOrCreate(
            ['email' => 'admin@pos.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'branch_id' => $mainBranch->id, // IMPORTANT
            ]
        );

        $superAdmin->assignRole('super-admin');

        /*
        |--------------------------------------------------------------------------
        | Branch Manager
        |--------------------------------------------------------------------------
        */
        $manager = User::firstOrCreate(
            ['email' => 'manager@pos.com'],
            [
                'name' => 'Branch Manager',
                'password' => Hash::make('password'),
                'branch_id' => $mainBranch->id,
            ]
        );

        $manager->assignRole('branch-manager');

        /*
        |--------------------------------------------------------------------------
        | Cashier
        |--------------------------------------------------------------------------
        */
        $cashier = User::firstOrCreate(
            ['email' => 'cashier@pos.com'],
            [
                'name' => 'Cashier',
                'password' => Hash::make('password'),
                'branch_id' => $mainBranch->id,
            ]
        );

        $cashier->assignRole('cashier');

        /*
        |--------------------------------------------------------------------------
        | Accountant
        |--------------------------------------------------------------------------
        */
        $accountant = User::firstOrCreate(
            ['email' => 'accountant@pos.com'],
            [
                'name' => 'Accountant',
                'password' => Hash::make('password'),
                'branch_id' => $mainBranch->id,
            ]
        );

        $accountant->assignRole('accountant');
    }
}
