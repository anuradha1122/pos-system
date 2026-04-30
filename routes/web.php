<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

use App\Http\Controllers\{
    DashboardController,
    BranchController,
    RoleController,
    UserController,
    CategoryController,
    BrandController,
    UnitController,
    ProductController,
    SupplierController,
    CustomerController,
    StockAdjustmentController,
    StockBalanceController,
    PurchaseController,
    PurchaseReturnController,
    SaleController,
    SaleReturnController,
    PaymentController,
    CustomerCreditController,
    SupplierCreditController,
    ExpenseController,
    DailyClosingController,
    AuditLogController,
    CompanySettingController,
    CustomerStatementController,
    SupplierStatementController,
    WelcomeController
};

use App\Http\Controllers\ReportController;
use App\Http\Controllers\CashFlowReportController;
use App\Http\Controllers\InventoryValuationReportController;
use App\Http\Controllers\ProfitByProductReportController;
use App\Http\Controllers\Report\ExpenseReportController;

use App\Http\Controllers\SaleDocumentController;
use App\Http\Controllers\PaymentReceiptController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

Route::middleware(['auth'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware('permission:dashboard.view')
        ->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */
    Route::resource('branches', BranchController::class)
        ->middleware('permission:branch.view');

    Route::resource('roles', RoleController::class)
        ->middleware('permission:role.view');

    Route::resource('users', UserController::class)
        ->middleware('permission:user.view');

    /*
    |--------------------------------------------------------------------------
    | Master Data
    |--------------------------------------------------------------------------
    */
    Route::resource('categories', CategoryController::class)
        ->middleware('permission:category.view');

    Route::resource('brands', BrandController::class)
        ->middleware('permission:brand.view');

    Route::resource('units', UnitController::class)
        ->middleware('permission:unit.view');

    Route::resource('products', ProductController::class)
        ->middleware('permission:product.view');

    Route::patch('/products/{product}/toggle-status', [ProductController::class, 'toggleStatus'])
        ->middleware('permission:product.update')
        ->name('products.toggle-status');

    /*
    |--------------------------------------------------------------------------
    | Customers & Suppliers
    |--------------------------------------------------------------------------
    */
    Route::resource('customers', CustomerController::class)
        ->middleware('permission:customer.view');

    Route::resource('suppliers', SupplierController::class)
        ->middleware('permission:supplier.view');

    Route::patch('/suppliers/{supplier}/toggle-status', [SupplierController::class, 'toggleStatus'])
        ->middleware('permission:supplier.update')
        ->name('suppliers.toggle-status');

    /*
    |--------------------------------------------------------------------------
    | Inventory
    |--------------------------------------------------------------------------
    */
    Route::get('/stock-balances', [StockBalanceController::class, 'index'])
        ->middleware('permission:stock-balance.view')
        ->name('stock-balances.index');

    Route::resource('stock-adjustments', StockAdjustmentController::class)
        ->middleware('permission:stock-adjustment.view');

    /*
    |--------------------------------------------------------------------------
    | Purchases
    |--------------------------------------------------------------------------
    */
    Route::resource('purchases', PurchaseController::class)
        ->middleware('permission:purchase.view');

    Route::resource('purchase-returns', PurchaseReturnController::class)
        ->middleware('permission:purchase-return.view');

    /*
    |--------------------------------------------------------------------------
    | Sales
    |--------------------------------------------------------------------------
    */
    Route::resource('sales', SaleController::class)
        ->middleware('permission:sale.view');

    Route::resource('sale-returns', SaleReturnController::class)
        ->middleware('permission:sale-return.view');

    /*
    |--------------------------------------------------------------------------
    | Sale Documents
    |--------------------------------------------------------------------------
    */
    Route::get('/sales/{sale}/thermal-receipt', [SaleDocumentController::class, 'thermal'])
        ->middleware('permission:sale.view')
        ->name('sales.thermal-receipt');

    Route::get('/sales/{sale}/invoice-pdf', [SaleDocumentController::class, 'invoicePdf'])
        ->middleware('permission:sale.view')
        ->name('sales.invoice-pdf');

    /*
    |--------------------------------------------------------------------------
    | Payments
    |--------------------------------------------------------------------------
    */
    Route::resource('payments', PaymentController::class)
        ->middleware('permission:payment.view');

    Route::get('/payments/{payment}/receipt', [PaymentReceiptController::class, 'show'])
        ->name('payments.receipt');

    Route::get('/payments/{payment}/receipt-pdf', [PaymentReceiptController::class, 'pdf'])
        ->name('payments.receipt.pdf');

    /*
    |--------------------------------------------------------------------------
    | Credits
    |--------------------------------------------------------------------------
    */
    Route::get('/customer-credits', [CustomerCreditController::class, 'index'])
        ->middleware('permission:customer-credit.view')
        ->name('customer-credits.index');

    Route::get('/customer-credits/{customer}', [CustomerCreditController::class, 'show'])
        ->middleware('permission:customer-credit.view')
        ->name('customer-credits.show');

    Route::post('/customer-credits/receive-payment', [CustomerCreditController::class, 'receivePayment'])
        ->middleware('permission:payment.create')
        ->name('customer-credits.receive-payment');


    Route::get('/supplier-credits', [SupplierCreditController::class, 'index'])
        ->middleware('permission:supplier-credit.view')
        ->name('supplier-credits.index');

    Route::get('/supplier-credits/{supplier}', [SupplierCreditController::class, 'show'])
        ->middleware('permission:supplier-credit.view')
        ->name('supplier-credits.show');

    Route::post('/supplier-credits/make-payment', [SupplierCreditController::class, 'makePayment'])
        ->middleware('permission:payment.create')
        ->name('supplier-credits.make-payment');

    /*
    |--------------------------------------------------------------------------
    | Expenses
    |--------------------------------------------------------------------------
    */
    Route::resource('expenses', ExpenseController::class)
        ->middleware('permission:expense.view');

    /*
    |--------------------------------------------------------------------------
    | Daily Closing
    |--------------------------------------------------------------------------
    */
    Route::resource('daily-closings', DailyClosingController::class)
        ->middleware('permission:daily-closing.view');

    Route::post('/daily-closings/{dailyClosing}/finalize', [DailyClosingController::class, 'finalize'])
        ->middleware('permission:daily-closing.finalize')
        ->name('daily-closings.finalize');

    /*
    |--------------------------------------------------------------------------
    | Reports
    |--------------------------------------------------------------------------
    */
    Route::prefix('reports')->name('reports.')->group(function () {

        Route::get('/sales', [ReportController::class, 'sales'])->name('sales');
        Route::get('/sales/export', [ReportController::class, 'salesExport'])->name('sales.export');

        Route::get('/profit', [ReportController::class, 'profit'])->name('profit');
        Route::get('/profit/export', [ReportController::class, 'profitExport'])->name('profit.export');

        Route::get('/low-stock', [ReportController::class, 'lowStock'])->name('low-stock');
        Route::get('/low-stock/export', [ReportController::class, 'lowStockExport'])->name('low-stock.export');

        Route::get('/stock-movements', [ReportController::class, 'stockMovements'])->name('stock-movements');
        Route::get('/stock-movements/export', [ReportController::class, 'stockMovementsExport'])->name('stock-movements.export');

        Route::get('/cash-flow', [CashFlowReportController::class, 'index'])->name('cash-flow.index');
        Route::get('/cash-flow/export', [CashFlowReportController::class, 'export'])->name('cash-flow.export');

        Route::get('/inventory-valuation', [InventoryValuationReportController::class, 'index'])->name('inventory-valuation.index');
        Route::get('/inventory-valuation/export', [InventoryValuationReportController::class, 'export'])->name('inventory-valuation.export');

        Route::get('/profit-by-product', [ProfitByProductReportController::class, 'index'])->name('profit-by-product.index');
        Route::get('/profit-by-product/export', [ProfitByProductReportController::class, 'export'])->name('profit-by-product.export');

        Route::get('/expenses', [ExpenseReportController::class, 'index'])->name('expenses');
        Route::get('/expenses/export', [ExpenseReportController::class, 'export'])->name('expenses.export');
    });

    /*
    |--------------------------------------------------------------------------
    | Statements
    |--------------------------------------------------------------------------
    */
    Route::get('/customer-statements', [CustomerStatementController::class, 'index'])
        ->middleware('permission:statement.customer.view')
        ->name('customer-statements.index');

    Route::get('/customer-statements/{customer}', [CustomerStatementController::class, 'show'])
        ->middleware('permission:statement.customer.view')
        ->name('customer-statements.show');

    Route::get('/customer-statements/{customer}/pdf', [CustomerStatementController::class, 'pdf'])
        ->middleware('permission:statement.customer.pdf')
        ->name('customer-statements.pdf');


    Route::get('/supplier-statements', [SupplierStatementController::class, 'index'])
        ->middleware('permission:statement.supplier.view')
        ->name('supplier-statements.index');

    Route::get('/supplier-statements/{supplier}', [SupplierStatementController::class, 'show'])
        ->middleware('permission:statement.supplier.view')
        ->name('supplier-statements.show');

    Route::get('/supplier-statements/{supplier}/pdf', [SupplierStatementController::class, 'pdf'])
        ->middleware('permission:statement.supplier.pdf')
        ->name('supplier-statements.pdf');

    /*
    |--------------------------------------------------------------------------
    | Settings
    |--------------------------------------------------------------------------
    */
    Route::get('/company-settings/edit', [CompanySettingController::class, 'edit'])
        ->name('company-settings.edit');

    Route::put('/company-settings', [CompanySettingController::class, 'update'])
        ->name('company-settings.update');

    /*
    |--------------------------------------------------------------------------
    | Audit
    |--------------------------------------------------------------------------
    */
    Route::get('/audit-logs', [AuditLogController::class, 'index'])
        ->middleware('permission:audit-log.view')
        ->name('audit-logs.index');

    Route::get('/audit-logs/{auditLog}', [AuditLogController::class, 'show'])
        ->middleware('permission:audit-log.view')
        ->name('audit-logs.show');

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

require __DIR__.'/auth.php';
