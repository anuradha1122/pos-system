<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard.view',

            'branch.view',
            'branch.create',
            'branch.edit',

            'role.view',
            'role.create',
            'role.edit',

            'user.view',
            'user.create',
            'user.edit',

            'product.view',
            'product.create',
            'product.edit',

            'supplier.view',
            'supplier.create',
            'supplier.edit',

            'category.view',
            'category.create',
            'category.edit',
            'brand.view',
            'brand.create',
            'brand.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $superAdmin = Role::firstOrCreate([
            'name' => 'super-admin',
            'guard_name' => 'web',
        ]);

        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $manager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);

        $superAdmin->syncPermissions(Permission::all());

        $admin->syncPermissions([
            'dashboard.view',
            'branch.view',
            'branch.create',
            'branch.edit',
            'role.view',
            'role.create',
            'role.edit',
            'user.view',
            'user.create',
            'user.edit',
            'product.view',
            'product.create',
            'product.edit',
            'category.view',
            'category.create',
            'category.edit',
            'supplier.view',
            'supplier.create',
            'supplier.edit',
            'brand.view',
            'brand.create',
            'brand.edit',
        ]);

        $manager->syncPermissions([
            'dashboard.view',
            'branch.view',
            'user.view',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
