<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaymentRequest;
use App\Models\Branch;
use App\Models\Payment;
use App\Services\Payment\PaymentService;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
    protected \App\Services\Payment\PaymentService $paymentService
    ) {
    }

    public function index(): Response
    {
        $payments = Payment::query()
            ->with(['branch', 'creator'])
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Payments/Create', [
            'branches' => Branch::query()->orderBy('name')->get(),
            'referenceTypes' => [
                'sale' => 'Sale',
                'purchase' => 'Purchase',
                'sale_return' => 'Sale Return',
                'purchase_return' => 'Purchase Return',
            ],
        ]);
    }

    public function store(StorePaymentRequest $request)
    {
        $this->paymentService->create($request->validated());

        return redirect()
            ->route('payments.index')
            ->with('success', 'Payment recorded successfully.');
    }
}
