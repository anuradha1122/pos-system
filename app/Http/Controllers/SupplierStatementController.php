<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use App\Services\Statement\SupplierStatementService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class SupplierStatementController extends Controller
{
    public function __construct(
        protected SupplierStatementService $supplierStatementService
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->input('search', ''),
        ];

        return Inertia::render('SupplierStatements/Index', [
            'filters' => $filters,
            'suppliers' => $this->supplierStatementService->getSuppliers($filters),
        ]);
    }

    public function show(Request $request, Supplier $supplier): Response
    {
        $filters = [
            'from' => $request->input('from', ''),
            'to' => $request->input('to', ''),
        ];

        return Inertia::render('SupplierStatements/Show', [
            'statement' => $this->supplierStatementService->getStatement($supplier, $filters),
        ]);
    }

    public function pdf(Request $request, Supplier $supplier): SymfonyResponse
    {
        $filters = [
            'from' => $request->input('from', ''),
            'to' => $request->input('to', ''),
        ];

        $statement = $this->supplierStatementService->getStatement($supplier, $filters);

        $pdf = Pdf::loadView('pdf.supplier-statement', [
            'statement' => $statement,
        ])->setPaper('a4', 'portrait');

        return $pdf->stream('supplier-statement-' . $supplier->id . '.pdf');
    }
}
