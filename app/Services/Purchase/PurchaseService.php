<?php

namespace App\Services\Purchase;

use App\Models\BranchProductStock;
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
            $totalAmount = collect($data['items'])->sum(function ($item) {
                return (float) $item['quantity'] * (float) $item['cost_price'];
            });

            $paidAmount = (float) ($data['paid_amount'] ?? 0);

            if ($paidAmount < 0) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot be negative.',
                ]);
            }

            if ($paidAmount > $totalAmount) {
                throw ValidationException::withMessages([
                    'paid_amount' => 'Paid amount cannot exceed purchase total.',
                ]);
            }

            $balanceAmount = $totalAmount - $paidAmount;

            $paymentStatus = match (true) {
                $paidAmount >= $totalAmount && $totalAmount > 0 => 'paid',
                $paidAmount > 0 => 'partial',
                default => 'credit',
            };

            $purchase = PurchaseHeader::create([
                'branch_id' => $data['branch_id'],
                'supplier_id' => $data['supplier_id'],
                'purchase_date' => $data['purchase_date'],
                'invoice_no' => $data['invoice_no'] ?? null,
                'note' => $data['note'] ?? null,
                'total_amount' => $totalAmount,
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
                    ->where('branch_id', $data['branch_id'])
                    ->where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock) {
                    $stock = BranchProductStock::create([
                        'branch_id' => $data['branch_id'],
                        'product_id' => $item['product_id'],
                        'quantity' => 0,
                    ]);
                }

                $newBalance = (float) $stock->quantity + $quantity;

                $stock->update([
                    'quantity' => $newBalance,
                ]);

                StockMovement::create([
                    'branch_id' => $data['branch_id'],
                    'product_id' => $item['product_id'],
                    'type' => 'purchase',
                    'qty_in' => $quantity,
                    'qty_out' => 0,
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
                    'branch_id' => $data['branch_id'],
                    'type' => 'out',
                    'amount' => $paidAmount,
                    'method' => $data['payment_method'] ?? 'cash',
                    'note' => 'Purchase payment: ' . ($purchase->invoice_no ?? ('Purchase #' . $purchase->id)),
                    'created_by' => Auth::id(),
                ]);
            }

            return $purchase->load(['branch', 'supplier', 'items.product']);
        });
    }
}
