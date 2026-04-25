<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerPaymentRequest;
use App\Models\Customer;
use App\Models\SaleHeader;
use App\Services\CustomerCredit\CustomerCreditService;
use Inertia\Inertia;
use Inertia\Response;

class CustomerCreditController extends Controller
{
    public function __construct(
        protected CustomerCreditService $customerCreditService
    ) {
    }

    public function index(): Response
    {
        $customers = Customer::query()
            ->withSum(['sales as total_credit_sales' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'grand_total')
            ->withSum(['sales as total_paid' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'paid_amount')
            ->withSum(['sales as outstanding_balance' => function ($query) {
                $query->where('balance_amount', '>', 0);
            }], 'balance_amount')
            ->whereHas('sales', function ($query) {
                $query->where('balance_amount', '>', 0);
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CustomerCredits/Index', [
            'customers' => $customers,
        ]);
    }

    public function show(Customer $customer): Response
    {
        $sales = SaleHeader::query()
            ->with(['branch', 'creator'])
            ->where('customer_id', $customer->id)
            ->where('balance_amount', '>', 0)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('CustomerCredits/Show', [
            'customer' => $customer,
            'sales' => $sales,
        ]);
    }

    public function receivePayment(StoreCustomerPaymentRequest $request)
    {
        $sale = $this->customerCreditService->receivePayment($request->validated());

        return redirect()
            ->route('customer-credits.show', $sale->customer_id)
            ->with('success', 'Customer payment received successfully.');
    }
}
