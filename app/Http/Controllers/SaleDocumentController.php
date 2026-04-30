<?php

namespace App\Http\Controllers;

use App\Services\Sale\SaleDocumentService;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;

class SaleDocumentController extends Controller
{
    public function __construct(
        protected SaleDocumentService $saleDocumentService
    ) {
    }

    public function thermal(int $sale): Response
    {
        $saleData = $this->saleDocumentService->getSaleForDocument($sale);
        $company = $this->saleDocumentService->getCompany();

        return Inertia::render('Sales/ThermalReceipt', [
            'sale' => $saleData,
            'totals' => $this->saleDocumentService->buildTotals($saleData),
            'company' => $company,
        ]);
    }

    public function invoicePdf(int $sale)
    {
        $saleData = $this->saleDocumentService->getSaleForDocument($sale);
        $totals = $this->saleDocumentService->buildTotals($saleData);
        $company = $this->saleDocumentService->getCompany();

        $pdf = Pdf::loadView('pdf.sales.invoice', [
            'sale' => $saleData,
            'totals' => $totals,
            'company' => $company,
        ])->setPaper('a4');

        return $pdf->download('invoice-sale-' . $saleData->invoice_no . '.pdf');
    }
}
