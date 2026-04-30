<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Services\Statement\CustomerStatementService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class CustomerStatementController extends Controller
{
    public function __construct(
        protected CustomerStatementService $customerStatementService
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search', ''),
        ];

        return Inertia::render('CustomerStatements/Index', [
            'filters' => $filters,
            'customers' => $this->customerStatementService->getCustomers($filters),
        ]);
    }

    public function show(Request $request, Customer $customer): Response
    {
        $filters = [
            'from' => $request->input('from', ''),
            'to' => $request->input('to', ''),
        ];

        return Inertia::render('CustomerStatements/Show', [
            'statement' => $this->customerStatementService->getStatement($customer, $filters),
        ]);
    }

    public function pdf(Request $request, Customer $customer): SymfonyResponse
    {
        $filters = [
            'from' => $request->input('from', ''),
            'to' => $request->input('to', ''),
        ];

        $statement = $this->customerStatementService->getStatement($customer, $filters);

        $pdf = Pdf::loadView('pdf.customer-statement', [
            'statement' => $statement,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('customer-statement-' . $customer->id . '.pdf');
    }
}
