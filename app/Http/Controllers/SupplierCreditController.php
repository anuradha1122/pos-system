<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSupplierPaymentRequest;
use App\Models\PurchaseHeader;
use App\Models\Supplier;
use App\Services\SupplierCredit\SupplierCreditService;
use Inertia\Inertia;
use Inertia\Response;

class SupplierCreditController extends Controller
{
    public function __construct(
        protected SupplierCreditService $supplierCreditService
    ) {
    }

    public function index(): Response
    {
        $suppliers = Supplier::query()
            ->withSum(['purchases as total_credit_purchases' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'grand_total')
            ->withSum(['purchases as total_paid' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'paid_amount')
            ->withSum(['purchases as outstanding_balance' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'balance_amount')
            ->whereHas('purchases', function ($query) {
                $query->where('balance_amount', '>', 0);
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SupplierCredits/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function show(Supplier $supplier): Response
    {
        $purchases = PurchaseHeader::query()
            ->with(['branch', 'creator'])
            ->where('supplier_id', $supplier->id)
            ->where('balance_amount', '>', 0)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('SupplierCredits/Show', [
            'supplier' => $supplier,
            'purchases' => $purchases,
        ]);
    }

    public function makePayment(StoreSupplierPaymentRequest $request)
    {
        $purchase = $this->supplierCreditService->makePayment($request->validated());

        return redirect()
            ->route('supplier-credits.show', $purchase->supplier_id)
            ->with('success', 'Supplier payment recorded successfully.');
    }
}
