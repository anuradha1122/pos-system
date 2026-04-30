<?php

namespace App\Services\PurchaseReturn;

use App\Models\BranchProductStock;
use App\Models\Payment;
use App\Models\PurchaseHeader;
use App\Models\PurchaseItem;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PurchaseReturnService
{
    public function create(array $data): PurchaseReturn
    {
        return DB::transaction(function () use ($data) {
            $purchase = PurchaseHeader::with('items')->findOrFail($data['purchase_header_id']);

            $totalAmount = 0;

            $return = PurchaseReturn::create([
                'purchase_header_id' => $purchase->id,
                'branch_id' => $purchase->branch_id,
                'supplier_id' => $purchase->supplier_id,
                'return_date' => $data['return_date'],
                'reason' => $data['reason'] ?? null,
                'total_amount' => 0,
                'refund_amount' => 0,
                'refund_method' => null,
                'refund_status' => 'none',
                'created_by' => Auth::id(),
            ]);

            foreach ($data['items'] as $item) {
                $purchaseItem = PurchaseItem::where('id', $item['purchase_item_id'])
                    ->where('purchase_header_id', $purchase->id)
                    ->firstOrFail();

                $returnQty = (float) $item['quantity'];

                $alreadyReturnedQty = PurchaseReturnItem::query()
                    ->where('purchase_item_id', $purchaseItem->id)
                    ->sum('quantity');

                $remainingQty = (float) $purchaseItem->quantity - (float) $alreadyReturnedQty;

                if ($returnQty > $remainingQty) {
                    throw ValidationException::withMessages([
                        'items' => "Return quantity exceeds purchased quantity for product ID {$item['product_id']}.",
                    ]);
                }

                $stock = BranchProductStock::query()
                    ->where('branch_id', $purchase->branch_id)
                    ->where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (! $stock || (float) $stock->quantity < $returnQty) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock to return product ID {$item['product_id']}.",
                    ]);
                }

                $costPrice = (float) $item['cost_price'];
                $lineTotal = $returnQty * $costPrice;

                $totalAmount += $lineTotal;

                PurchaseReturnItem::create([
                    'purchase_return_id' => $return->id,
                    'purchase_item_id' => $purchaseItem->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $returnQty,
                    'cost_price' => $costPrice,
                    'line_total' => $lineTotal,
                ]);

                $stock->quantity = (float) $stock->quantity - $returnQty;
                $stock->save();

                StockMovement::create([
                    'branch_id' => $purchase->branch_id,
                    'product_id' => $item['product_id'],
                    'type' => 'purchase_return',
                    'qty_in' => 0,
                    'qty_out' => $returnQty,
                    'balance_after' => $stock->quantity,
                    'reference_type' => PurchaseReturn::class,
                    'reference_id' => $return->id,
                    'created_by' => Auth::id(),
                ]);
            }

            $refundAmount = (float) ($data['refund_amount'] ?? 0);

            if ($refundAmount < 0) {
                throw ValidationException::withMessages([
                    'refund_amount' => 'Refund amount cannot be negative.',
                ]);
            }

            if ($refundAmount > $totalAmount) {
                throw ValidationException::withMessages([
                    'refund_amount' => 'Refund amount cannot exceed return total.',
                ]);
            }

            $refundStatus = match (true) {
                $refundAmount >= $totalAmount && $totalAmount > 0 => 'refunded',
                $refundAmount > 0 => 'partial',
                ($data['refund_method'] ?? null) === 'credit' => 'credit',
                default => 'none',
            };

            $return->update([
                'total_amount' => $totalAmount,
                'refund_amount' => $refundAmount,
                'refund_method' => $data['refund_method'] ?? null,
                'refund_status' => $refundStatus,
            ]);

            if ($refundAmount > 0) {
                Payment::create([
                    'reference_type' => 'purchase_return',
                    'reference_id' => $return->id,
                    'branch_id' => $return->branch_id,
                    'type' => 'in',
                    'amount' => $refundAmount,
                    'method' => $data['refund_method'] ?? 'cash',
                    'note' => 'Purchase return supplier refund',
                    'created_by' => Auth::id(),
                ]);
            }

            return $return->load([
                'purchase',
                'supplier',
                'branch',
                'items.product',
                'creator',
            ]);
        });
    }
}
