<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\StockAdjustmentController;
use App\Http\Controllers\StockBalanceController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Route::get('/', function () {
//     return redirect()->route('dashboard');
// });

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('can:dashboard.view')
        ->name('dashboard');

    Route::get('/branches', [BranchController::class, 'index'])
        ->middleware('can:branch.view')
        ->name('branches.index');

    Route::get('/branches/create', [BranchController::class, 'create'])
        ->middleware('can:branch.create')
        ->name('branches.create');

    Route::post('/branches', [BranchController::class, 'store'])
        ->middleware('can:branch.create')
        ->name('branches.store');

    Route::get('/branches/{branch}/edit', [BranchController::class, 'edit'])
        ->middleware('can:branch.update')
        ->name('branches.edit');

    Route::put('/branches/{branch}', [BranchController::class, 'update'])
        ->middleware('can:branch.update')
        ->name('branches.update');

    Route::get('/users', [UserController::class, 'index'])
        ->name('users.index')
        ->middleware('can:user.view');

    Route::get('/users/create', [UserController::class, 'create'])
        ->name('users.create')
        ->middleware('can:user.create');

    Route::post('/users', [UserController::class, 'store'])
        ->name('users.store')
        ->middleware('can:user.create');

    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('users.edit')
        ->middleware('can:user.edit');

    Route::put('/users/{user}', [UserController::class, 'update'])
        ->name('users.update')
        ->middleware('can:user.edit');

    Route::get('/roles', [RoleController::class, 'index'])
        ->name('roles.index')
        ->middleware('can:role.view');

    Route::get('/roles/create', [RoleController::class, 'create'])
        ->name('roles.create')
        ->middleware('can:role.create');

    Route::post('/roles', [RoleController::class, 'store'])
        ->name('roles.store')
        ->middleware('can:role.create');

    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])
        ->name('roles.edit')
        ->middleware('can:role.edit');

    Route::put('/roles/{role}', [RoleController::class, 'update'])
        ->name('roles.update')
        ->middleware('can:role.edit');


    Route::resource('categories', CategoryController::class)->except(['show', 'destroy']);
    Route::resource('brands', BrandController::class)->except(['show', 'destroy']);
    Route::resource('units', UnitController::class)->except(['show', 'destroy']);


    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update');



    // optional deactivate action
    Route::patch('/products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])->name('products.toggle-status');


    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('/suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::get('/suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
    Route::patch('/suppliers/{supplier}/toggle-status', [SupplierController::class, 'toggleStatus'])->name('suppliers.toggle-status');


    Route::get('/stock-adjustments', [StockAdjustmentController::class, 'index'])->name('stock-adjustments.index');
    Route::get('/stock-adjustments/create', [StockAdjustmentController::class, 'create'])->name('stock-adjustments.create');
    Route::post('/stock-adjustments', [StockAdjustmentController::class, 'store'])->name('stock-adjustments.store');

    Route::get('/stock-balances', [StockBalanceController::class, 'index'])->name('stock-balances.index');

    Route::get('/reports/stock-movements', [ReportController::class, 'stockMovements'])
    ->name('reports.stock-movements');

    Route::get('/purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    Route::get('/purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
    Route::post('/purchases', [PurchaseController::class, 'store'])->name('purchases.store');
    Route::get('/purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');

    Route::resource('customers', CustomerController::class)->except(['show', 'destroy']);


    Route::get('/sales', [SaleController::class, 'index'])->name('sales.index');
    Route::get('/sales/create', [SaleController::class, 'create'])->name('sales.create');
    Route::post('/sales', [SaleController::class, 'store'])->name('sales.store');
    Route::get('/sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    Route::get('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::get('/reports/low-stock', [ReportController::class, 'lowStock'])
    ->name('reports.low-stock');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->name('logout');
});

require __DIR__.'/auth.php';
