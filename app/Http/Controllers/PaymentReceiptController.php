<?php

namespace App\Http\Controllers;

use App\Services\Payment\PaymentDocumentService;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class PaymentReceiptController extends Controller
{
    public function __construct(
        protected PaymentDocumentService $paymentDocumentService
    ) {
    }

    public function show(int $payment): Response
    {
        $paymentData = $this->paymentDocumentService->getPaymentForReceipt($payment);

        return Inertia::render('Payments/Receipt', [
            'payment' => $paymentData,
            'company' => $this->paymentDocumentService->getCompany(),
            'receiptNo' => $this->paymentDocumentService->buildReceiptNo($paymentData),
        ]);
    }

    public function pdf(int $payment): SymfonyResponse
    {
        $paymentData = $this->paymentDocumentService->getPaymentForReceipt($payment);

        $pdf = Pdf::loadView('pdf.payment-receipt', [
            'payment' => $paymentData,
            'company' => $this->paymentDocumentService->getCompany(),
            'receiptNo' => $this->paymentDocumentService->buildReceiptNo($paymentData),
        ])->setPaper('a5', 'portrait');

        return $pdf->stream('payment-receipt-' . $paymentData->id . '.pdf');
    }
}
