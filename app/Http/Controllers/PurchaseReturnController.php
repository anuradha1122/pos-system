<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePurchaseReturnRequest;
use App\Models\PurchaseHeader;
use App\Models\PurchaseReturn;
use App\Services\PurchaseReturn\PurchaseReturnService;
use Inertia\Inertia;
use Inertia\Response;

class PurchaseReturnController extends Controller
{
    public function __construct(
        protected PurchaseReturnService $purchaseReturnService
    ) {
    }

    public function index(): Response
    {
        $purchaseReturns = PurchaseReturn::query()
            ->with(['purchase', 'supplier', 'branch', 'creator'])
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PurchaseReturns/Index', [
            'purchaseReturns' => $purchaseReturns,
        ]);
    }

    public function create(): Response
    {
        $purchases = PurchaseHeader::query()
            ->with(['supplier', 'branch', 'items.product'])
            ->latest()
            ->get();

        return Inertia::render('PurchaseReturns/Create', [
            'purchases' => $purchases,
        ]);
    }

    public function store(StorePurchaseReturnRequest $request)
    {
        $purchaseReturn = $this->purchaseReturnService->create($request->validated());

        return redirect()
            ->route('purchase-returns.show', $purchaseReturn->id)
            ->with('success', 'Purchase return created successfully.');
    }

    public function show(PurchaseReturn $purchaseReturn): Response
    {
        $purchaseReturn->load([
            'purchase',
            'supplier',
            'branch',
            'items.product',
            'creator',
        ]);

        return Inertia::render('PurchaseReturns/Show', [
            'purchaseReturn' => $purchaseReturn,
        ]);
    }
}
