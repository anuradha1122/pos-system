<?php

namespace App\Services\Sale;

use App\Models\BranchProductStock;
use App\Models\Payment;
use App\Models\Product;
use App\Models\SaleHeader;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleService
{
    public function create(array $data): SaleHeader
    {
        return DB::transaction(function () use ($data) {
            $user = Auth::user();
            $branchId = $user->branch_id;

            if (!$branchId) {
                throw ValidationException::withMessages([
                    'branch' => 'Authenticated user is not assigned to a branch.',
                ]);
            }

            $subtotal = 0;
            $preparedItems = [];

            foreach ($data['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                $quantity = (float) $item['quantity'];
                $unitPrice = (float) $item['unit_price'];
                $lineTotal = $quantity * $unitPrice;

                $stock = BranchProductStock::query()
                    ->where('branch_id', $branchId)
                    ->where('product_id', $product->id)
                    ->lockForUpdate()
                    ->first();

                if (!$stock || (float) $stock->quantity < $quantity) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for product: {$product->name}"],
                    ]);
                }

                $subtotal += $lineTotal;

                $preparedItems[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'line_total' => $lineTotal,
                    'stock' => $stock,
                ];
            }

            $discount = (float) ($data['discount'] ?? 0);
            $tax = (float) ($data['tax'] ?? 0);
            $grandTotal = $subtotal - $discount + $tax;

            if ($grandTotal < 0) {
                throw ValidationException::withMessages([
                    'discount' => 'Grand total cannot be negative.',
                ]);
            }

            $paidAmount = (float) ($data['paid_amount'] ?? 0);

            if ($paidAmount < 0) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot be negative.',
                ]);
            }

            if ($paidAmount > $grandTotal) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot exceed grand total.',
                ]);
            }

            $balanceAmount = $grandTotal - $paidAmount;

            $paymentStatus = match (true) {
                $paidAmount >= $grandTotal && $grandTotal > 0 => 'paid',
                $paidAmount > 0 => 'partial',
                default => 'credit',
            };

            $sale = SaleHeader::create([
                'invoice_no' => $this->generateInvoiceNo(),
                'branch_id' => $branchId,
                'customer_id' => $data['customer_id'] ?? null,
                'sale_date' => $data['sale_date'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'grand_total' => $grandTotal,
                'paid_amount' => $paidAmount,
                'balance_amount' => $balanceAmount,
                'payment_status' => $paymentStatus,
                'notes' => $data['notes'] ?? null,
                'created_by' => $user->id,
            ]);

            foreach ($preparedItems as $item) {
                $sale->items()->create([
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $item['line_total'],
                ]);

                $currentQty = (float) $item['stock']->quantity;
                $soldQty = (float) $item['quantity'];
                $newQty = $currentQty - $soldQty;

                if ($newQty < 0) {
                    throw ValidationException::withMessages([
                        'items' => ["Insufficient stock for product: {$item['product']->name}"],
                    ]);
                }

                $item['stock']->update([
                    'quantity' => $newQty,
                ]);

                StockMovement::create([
                    'branch_id' => $branchId,
                    'product_id' => $item['product']->id,
                    'type' => 'sale',
                    'qty_in' => 0,
                    'qty_out' => $soldQty,
                    'quantity' => $soldQty,
                    'balance_after' => $newQty,
                    'reference_type' => SaleHeader::class,
                    'reference_id' => $sale->id,
                    'note' => 'Sale invoice: ' . $sale->invoice_no,
                    'created_by' => $user->id,
                ]);
            }

            if ($paidAmount > 0) {
                Payment::create([
                    'reference_type' => 'sale',
                    'reference_id' => $sale->id,
                    'branch_id' => $branchId,
                    'type' => 'in',
                    'amount' => $paidAmount,
                    'method' => $data['payment_method'] ?? 'cash',
                    'note' => 'Sale payment: ' . $sale->invoice_no,
                    'created_by' => $user->id,
                ]);
            }

            return $sale->load(['items.product', 'customer', 'branch', 'creator']);
        });
    }

    protected function generateInvoiceNo(): string
    {
        $date = now()->format('Ymd');
        $lastId = SaleHeader::max('id') ?? 0;

        return 'INV-' . $date . '-' . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);
    }
}
