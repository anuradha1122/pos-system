<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'dashboard.view',
            'branch.view',
            'branch.create',
            'branch.update',
            'user.view',
            'user.create',
            'user.update',
            'role.view',
            'role.create',
            'role.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $manager = Role::firstOrCreate(['name' => 'manager']);

        $superAdmin->syncPermissions($permissions);

        $admin->syncPermissions([
            'dashboard.view',
            'branch.view',
            'user.view',
            'user.create',
            'user.update',
            'role.view',
        ]);

        $manager->syncPermissions([
            'dashboard.view',
            'user.view',
        ]);
    }
}
