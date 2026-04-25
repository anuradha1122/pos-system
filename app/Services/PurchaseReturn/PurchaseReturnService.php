<?php

namespace App\Services\PurchaseReturn;

use App\Models\BranchProductStock;
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
                'created_by' => Auth::id(),
            ]);

            foreach ($data['items'] as $item) {
                $purchaseItem = PurchaseItem::where('id', $item['purchase_item_id'])
                    ->where('purchase_header_id', $purchase->id)
                    ->firstOrFail();

                $alreadyReturnedQty = PurchaseReturnItem::query()
                    ->where('purchase_item_id', $purchaseItem->id)
                    ->sum('quantity');

                $remainingQty = $purchaseItem->quantity - $alreadyReturnedQty;

                if ($item['quantity'] > $remainingQty) {
                    throw ValidationException::withMessages([
                        'items' => "Return quantity exceeds purchased quantity for product ID {$item['product_id']}.",
                    ]);
                }

                $stock = BranchProductStock::where('branch_id', $purchase->branch_id)
                    ->where('product_id', $item['product_id'])
                    ->lockForUpdate()
                    ->first();

                if (!$stock || $stock->quantity < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Insufficient stock to return product ID {$item['product_id']}.",
                    ]);
                }

                $lineTotal = $item['quantity'] * $item['cost_price'];
                $totalAmount += $lineTotal;

                PurchaseReturnItem::create([
                    'purchase_return_id' => $return->id,
                    'purchase_item_id' => $purchaseItem->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'cost_price' => $item['cost_price'],
                    'line_total' => $lineTotal,
                ]);

                $stock->quantity -= $item['quantity'];
                $stock->save();

                StockMovement::create([
                    'branch_id' => $purchase->branch_id,
                    'product_id' => $item['product_id'],
                    'type' => 'purchase_return',
                    'qty_in' => 0,
                    'qty_out' => $item['quantity'],
                    'balance_after' => $stock->quantity,
                    'reference_type' => PurchaseReturn::class,
                    'reference_id' => $return->id,
                    'created_by' => Auth::id(),
                ]);
            }

            $return->update([
                'total_amount' => $totalAmount,
            ]);

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
