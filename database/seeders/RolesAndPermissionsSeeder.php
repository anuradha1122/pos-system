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
            // Dashboard
            'dashboard.view',

            // User Management
            'branch.view', 'branch.create', 'branch.update', 'branch.delete',
            'role.view', 'role.create', 'role.update', 'role.delete', 'role.edit',
            'user.view', 'user.create', 'user.update', 'user.delete', 'user.edit',

            // Master Data
            'category.view', 'category.create', 'category.update', 'category.delete',
            'brand.view', 'brand.create', 'brand.update', 'brand.delete',
            'unit.view', 'unit.create', 'unit.update', 'unit.delete',
            'product.view', 'product.create', 'product.update', 'product.delete',

            // Business Entities
            'customer.view', 'customer.create', 'customer.update', 'customer.delete',
            'supplier.view', 'supplier.create', 'supplier.update', 'supplier.delete',

            // Inventory
            'stock-balance.view',
            'stock-movement.view',
            'stock-adjustment.view', 'stock-adjustment.create', 'stock-adjustment.update', 'stock-adjustment.delete',

            // Purchases
            'purchase.view', 'purchase.create', 'purchase.show',
            'purchase-return.view', 'purchase-return.create', 'purchase-return.show',

            // Sales
            'sale.view', 'sale.create', 'sale.show',
            'sale-return.view', 'sale-return.create', 'sale-return.show',

            // Credits
            'customer-credit.view',
            'supplier-credit.view',

            // Payments
            'payment.view', 'payment.create', 'payment.show',
            'payment.receipt',

            // Expenses
            'expense.view', 'expense.create', 'expense.update', 'expense.delete',

            // Daily Closing
            'daily-closing.view',
            'daily-closing.create',
            'daily-closing.update',
            'daily-closing.finalize',

            // Reports
            'report.sales.view',
            'report.sales.export',
            'report.profit.view',
            'report.profit.export',
            'report.profit-by-product.view',
            'report.profit-by-product.export',
            'report.cash-flow.view',
            'report.cash-flow.export',
            'report.inventory-valuation.view',
            'report.inventory-valuation.export',
            'report.stock-movement.view',
            'report.stock-movement.export',
            'report.low-stock.view',
            'report.low-stock.export',
            'report.expense.view',
            'report.expense.export',

            // Statements
            'statement.customer.view',
            'statement.customer.pdf',
            'statement.supplier.view',
            'statement.supplier.pdf',

            // Settings
            'company-settings.view',
            'company-settings.update',

            // Audit
            'audit-log.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $superAdmin = Role::firstOrCreate(['name' => 'super-admin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $branchManager = Role::firstOrCreate(['name' => 'branch-manager']);
        $cashier = Role::firstOrCreate(['name' => 'cashier']);
        $inventoryManager = Role::firstOrCreate(['name' => 'inventory-manager']);
        $accountant = Role::firstOrCreate(['name' => 'accountant']);
        $viewer = Role::firstOrCreate(['name' => 'viewer']);

        $superAdmin->syncPermissions(Permission::all());

        $admin->syncPermissions(Permission::all());

        $branchManager->syncPermissions([
            'dashboard.view',

            'product.view',
            'customer.view', 'customer.create', 'customer.update',
            'supplier.view', 'supplier.create', 'supplier.update',

            'stock-balance.view',
            'stock-movement.view',
            'stock-adjustment.view', 'stock-adjustment.create',

            'purchase.view', 'purchase.create', 'purchase.show',
            'purchase-return.view', 'purchase-return.create', 'purchase-return.show',

            'sale.view', 'sale.create', 'sale.show',
            'sale-return.view', 'sale-return.create', 'sale-return.show',

            'customer-credit.view',
            'supplier-credit.view',

            'payment.view', 'payment.create', 'payment.show', 'payment.receipt',

            'expense.view', 'expense.create',

            'daily-closing.view',
            'daily-closing.create',
            'daily-closing.finalize',

            'report.sales.view',
            'report.profit.view',
            'report.profit-by-product.view',
            'report.cash-flow.view',
            'report.inventory-valuation.view',
            'report.stock-movement.view',
            'report.low-stock.view',
            'report.expense.view',

            'statement.customer.view',
            'statement.customer.pdf',
            'statement.supplier.view',
            'statement.supplier.pdf',
        ]);

        $cashier->syncPermissions([
            'dashboard.view',

            'product.view',
            'customer.view', 'customer.create',

            'stock-balance.view',

            'sale.view', 'sale.create', 'sale.show',
            'sale-return.view', 'sale-return.create', 'sale-return.show',

            'customer-credit.view',

            'payment.view', 'payment.create', 'payment.show', 'payment.receipt',

            'daily-closing.view',
            'daily-closing.create',
        ]);

        $inventoryManager->syncPermissions([
            'dashboard.view',

            'category.view',
            'brand.view',
            'unit.view',

            'product.view', 'product.create', 'product.update',

            'supplier.view', 'supplier.create', 'supplier.update',

            'stock-balance.view',
            'stock-movement.view',
            'stock-adjustment.view', 'stock-adjustment.create',

            'purchase.view', 'purchase.create', 'purchase.show',
            'purchase-return.view', 'purchase-return.create', 'purchase-return.show',

            'report.inventory-valuation.view',
            'report.stock-movement.view',
            'report.low-stock.view',
        ]);

        $accountant->syncPermissions([
            'dashboard.view',

            'customer.view',
            'supplier.view',

            'customer-credit.view',
            'supplier-credit.view',

            'payment.view', 'payment.create', 'payment.show', 'payment.receipt',

            'expense.view', 'expense.create', 'expense.update',

            'daily-closing.view',
            'daily-closing.create',
            'daily-closing.finalize',

            'report.sales.view',
            'report.sales.export',
            'report.profit.view',
            'report.profit.export',
            'report.profit-by-product.view',
            'report.cash-flow.view',
            'report.cash-flow.export',
            'report.expense.view',
            'report.expense.export',

            'statement.customer.view',
            'statement.customer.pdf',
            'statement.supplier.view',
            'statement.supplier.pdf',
        ]);

        $viewer->syncPermissions([
            'dashboard.view',

            'product.view',
            'customer.view',
            'supplier.view',
            'stock-balance.view',

            'sale.view',
            'purchase.view',
            'payment.view',
            'expense.view',

            'report.sales.view',
            'report.profit.view',
            'report.cash-flow.view',
            'report.low-stock.view',

            'statement.customer.view',
            'statement.supplier.view',
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
