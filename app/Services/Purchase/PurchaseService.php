<?php

namespace App\Services\Purchase;

use App\Models\BranchProductStock;
use App\Models\CompanySetting;
use App\Models\Payment;
use App\Models\PurchaseHeader;
use App\Models\PurchaseItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseService
{
    public function create(array $data): PurchaseHeader
    {
        return DB::transaction(function () use ($data) {
            $branchId = Auth::user()->branch_id;

            if (!$branchId) {
                throw ValidationException::withMessages([
                    'branch_id' => 'Authenticated user is not assigned to a branch.',
                ]);
            }

            $subtotal = collect($data['items'])->sum(function ($item) {
                return (float) $item['quantity'] * (float) $item['cost_price'];
            });

            $discount = 0;
            $tax = 0;
            $grandTotal = $subtotal - $discount + $tax;

            $paidAmount = (float) ($data['paid_amount'] ?? 0);

            if ($paidAmount < 0) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot be negative.',
                ]);
            }

            if ($paidAmount > $grandTotal) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot exceed purchase total.',
                ]);
            }

            $balanceAmount = $grandTotal - $paidAmount;

            $paymentStatus = match (true) {
                $paidAmount >= $grandTotal && $grandTotal > 0 => 'paid',
                $paidAmount > 0 => 'partial',
                default => 'credit',
            };

            $purchase = PurchaseHeader::create([
                'purchase_no' => $this->generatePurchaseNo(),
                'branch_id' => $branchId,
                'supplier_id' => $data['supplier_id'],
                'purchase_date' => $data['purchase_date'],
                'invoice_no' => $data['invoice_no'] ?? null,

                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'grand_total' => $grandTotal,

                'notes' => $data['note'] ?? null,

                'paid_amount' => $paidAmount,
                'balance_amount' => $balanceAmount,
                'payment_status' => $paymentStatus,
                'created_by' => Auth::id(),
            ]);

            foreach ($data['items'] as $item) {
                $quantity = (float) $item['quantity'];
                $costPrice = (float) $item['cost_price'];
                $lineTotal = $quantity * $costPrice;

                PurchaseItem::create([
                    'purchase_header_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $quantity,
                    'cost_price' => $costPrice,
                    'line_total' => $lineTotal,
                ]);

                $stock = BranchProductStock::query()
                    ->where('branch_id', $branchId)
                    ->where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock) {
                    $stock = BranchProductStock::create([
                        'branch_id' => $branchId,
                        'product_id' => $item['product_id'],
                        'quantity' => 0,
                        'reorder_level' => 0,
                    ]);
                }

                $newBalance = (float) $stock->quantity + $quantity;

                $stock->update([
                    'quantity' => $newBalance,
                ]);

                StockMovement::create([
                    'branch_id' => $branchId,
                    'product_id' => $item['product_id'],
                    'type' => 'purchase',
                    'qty_in' => $quantity,
                    'qty_out' => 0,
                    'quantity' => $quantity,
                    'balance_after' => $newBalance,
                    'reference_type' => 'purchase',
                    'reference_id' => $purchase->id,
                    'note' => $data['note'] ?? null,
                    'created_by' => Auth::id(),
                ]);
            }

            if ($paidAmount > 0) {
                Payment::create([
                    'reference_type' => 'purchase',
                    'reference_id' => $purchase->id,
                    'branch_id' => $branchId,
                    'type' => 'out',
                    'amount' => $paidAmount,
                    'method' => $data['payment_method'] ?? 'cash',
                    'payment_date' => $purchase->purchase_date,
                    'note' => 'Purchase payment: ' . ($purchase->invoice_no ?? $purchase->purchase_no),
                    'created_by' => Auth::id(),
                ]);
            }

            return $purchase->load(['branch', 'supplier', 'items.product', 'creator']);
        });
    }

    protected function generatePurchaseNo(): string
    {
        $setting = CompanySetting::first();

        $prefix = $setting?->purchase_prefix ?: 'PUR';
        $date = now()->format('Ymd');

        $lastId = PurchaseHeader::max('id') ?? 0;

        return $prefix . '-' . $date . '-' . str_pad($lastId + 1, 5, '0', STR_PAD_LEFT);
    }
}
