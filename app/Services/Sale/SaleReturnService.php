<?php

namespace App\Services\Sale;

use App\Models\BranchProductStock;
use App\Models\Payment;
use App\Models\SaleHeader;
use App\Models\SaleItem;
use App\Models\SaleReturn;
use App\Models\SaleReturnItem;
use App\Models\StockMovement;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaleReturnService
{
    public function create(array $data): SaleReturn
    {
        return DB::transaction(function () use ($data) {
            $sale = SaleHeader::query()
                ->with(['items'])
                ->lockForUpdate()
                ->findOrFail($data['sale_header_id']);

            $returnNo = $this->generateReturnNo();

            $saleReturn = SaleReturn::create([
                'return_no' => $returnNo,
                'sale_header_id' => $sale->id,
                'branch_id' => $sale->branch_id,
                'customer_id' => $sale->customer_id,
                'return_date' => $data['return_date'],
                'subtotal' => 0,
                'total_amount' => 0,
                'refund_amount' => 0,
                'refund_method' => null,
                'refund_status' => 'none',
                'reason' => $data['reason'] ?? null,
                'created_by' => Auth::id(),
            ]);

            $totalAmount = 0;

            foreach ($data['items'] as $itemData) {
                $saleItem = SaleItem::query()
                    ->where('sale_header_id', $sale->id)
                    ->where('id', $itemData['sale_item_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                $returnQty = (float) $itemData['quantity'];

                $alreadyReturnedQty = SaleReturnItem::query()
                    ->where('sale_item_id', $saleItem->id)
                    ->sum('quantity');

                $availableReturnQty = (float) $saleItem->quantity - (float) $alreadyReturnedQty;

                if ($returnQty > $availableReturnQty) {
                    throw ValidationException::withMessages([
                        'items' => "Return quantity for product ID {$saleItem->product_id} exceeds available return quantity.",
                    ]);
                }

                $lineTotal = $returnQty * (float) $saleItem->unit_price;

                SaleReturnItem::create([
                    'sale_return_id' => $saleReturn->id,
                    'sale_item_id' => $saleItem->id,
                    'product_id' => $saleItem->product_id,
                    'quantity' => $returnQty,
                    'unit_price' => $saleItem->unit_price,
                    'line_total' => $lineTotal,
                ]);

                $stock = BranchProductStock::query()
                    ->where('branch_id', $sale->branch_id)
                    ->where('product_id', $saleItem->product_id)
                    ->lockForUpdate()
                    ->first();

                if (! $stock) {
                    $stock = BranchProductStock::create([
                        'branch_id' => $sale->branch_id,
                        'product_id' => $saleItem->product_id,
                        'quantity' => 0,
                        'reorder_level' => 0,
                    ]);
                }

                $stock->quantity = (float) $stock->quantity + $returnQty;
                $stock->save();

                StockMovement::create([
                    'branch_id' => $sale->branch_id,
                    'product_id' => $saleItem->product_id,
                    'type' => 'sale_return',
                    'qty_in' => $returnQty,
                    'qty_out' => 0,
                    'balance_after' => $stock->quantity,
                    'reference_type' => SaleReturn::class,
                    'reference_id' => $saleReturn->id,
                    'created_by' => Auth::id(),
                ]);

                $totalAmount += $lineTotal;
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

            $saleReturn->update([
                'subtotal' => $totalAmount,
                'total_amount' => $totalAmount,
                'refund_amount' => $refundAmount,
                'refund_method' => $data['refund_method'] ?? null,
                'refund_status' => $refundStatus,
            ]);

            if ($refundAmount > 0) {
                Payment::create([
                    'reference_type' => 'sale_return',
                    'reference_id' => $saleReturn->id,
                    'branch_id' => $saleReturn->branch_id,
                    'type' => 'out',
                    'amount' => $refundAmount,
                    'method' => $data['refund_method'] ?? 'cash',
                    'note' => 'Sales return refund: ' . $saleReturn->return_no,
                    'created_by' => Auth::id(),
                ]);
            }

            return $saleReturn->load([
                'sale',
                'branch',
                'customer',
                'creator',
                'items.product',
                'items.saleItem',
            ]);
        });
    }

    protected function generateReturnNo(): string
    {
        $prefix = 'SR-' . now()->format('Ymd') . '-';

        $latest = SaleReturn::query()
            ->where('return_no', 'like', $prefix . '%')
            ->latest('id')
            ->first();

        $next = 1;

        if ($latest) {
            $lastNumber = (int) str_replace($prefix, '', $latest->return_no);
            $next = $lastNumber + 1;
        }

        return $prefix . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
