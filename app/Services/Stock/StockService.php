<?php

namespace App\Services\Stock;

use App\Models\BranchProductStock;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class StockService
{
    public function adjust(array $data): void
    {
        DB::transaction(function () use ($data) {
            $stock = BranchProductStock::query()
                ->lockForUpdate()
                ->firstOrCreate(
                    [
                        'branch_id' => $data['branch_id'],
                        'product_id' => $data['product_id'],
                    ],
                    [
                        'quantity' => 0,
                    ]
                );

            $currentQty = (float) $stock->quantity;
            $adjustQty = (float) $data['quantity'];

            $qtyIn = 0;
            $qtyOut = 0;
            $newBalance = $currentQty;

            if ($data['type'] === 'opening_stock' || $data['type'] === 'adjustment_in') {
                $qtyIn = $adjustQty;
                $newBalance = $currentQty + $adjustQty;
            }

            if ($data['type'] === 'adjustment_out') {
                if ($adjustQty > $currentQty) {
                    throw new RuntimeException('Insufficient stock for adjustment out.');
                }

                $qtyOut = $adjustQty;
                $newBalance = $currentQty - $adjustQty;
            }

            $stock->update([
                'quantity' => $newBalance,
            ]);

            StockMovement::create([
                'branch_id' => $data['branch_id'],
                'product_id' => $data['product_id'],
                'type' => $data['type'],
                'qty_in' => $qtyIn,
                'qty_out' => $qtyOut,
                'balance_after' => $newBalance,
                'reference_type' => 'manual_adjustment',
                'reference_id' => null,
                'note' => $data['note'] ?? null,
                'created_by' => Auth::id(),
            ]);
        });
    }
}
