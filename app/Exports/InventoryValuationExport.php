<?php

namespace App\Exports;

use App\Models\BranchProductStock;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class InventoryValuationExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        return BranchProductStock::query()
            ->with([
                'branch',
                'product.category',
                'product.brand',
            ])
            ->when($this->filters['branch_id'] ?? null, fn($q, $id) =>
                $q->where('branch_id', $id)
            )
            ->when($this->filters['category_id'] ?? null, function ($q, $id) {
                $q->whereHas('product', fn($p) =>
                    $p->where('category_id', $id)
                );
            })
            ->when($this->filters['brand_id'] ?? null, function ($q, $id) {
                $q->whereHas('product', fn($p) =>
                    $p->where('brand_id', $id)
                );
            })
            ->when($this->filters['search'] ?? null, function ($q, $search) {
                $q->whereHas('product', function ($p) use ($search) {
                    $p->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->get()
            ->map(function ($stock) {
                $cost = (float) ($stock->product->cost_price ?? 0);
                $qty = (float) $stock->quantity;
                $value = $qty * $cost;

                return [
                    'Product' => $stock->product->name ?? '-',
                    'SKU' => $stock->product->sku ?? '-',
                    'Category' => $stock->product->category->name ?? '-',
                    'Brand' => $stock->product->brand->name ?? '-',
                    'Branch' => $stock->branch->name ?? '-',
                    'Quantity' => $qty,
                    'Reorder Level' => $stock->reorder_level,
                    'Cost Price' => $cost,
                    'Stock Value' => $value,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Product',
            'SKU',
            'Category',
            'Brand',
            'Branch',
            'Quantity',
            'Reorder Level',
            'Cost Price',
            'Stock Value',
        ];
    }
}
