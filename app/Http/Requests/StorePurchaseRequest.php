<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePurchaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['required', 'exists:branches,id'],
            'supplier_id' => ['required', 'exists:suppliers,id'],
            'purchase_date' => ['required', 'date'],
            'invoice_no' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'gt:0'],
            'items.*.cost_price' => ['required', 'numeric', 'min:0'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $items = collect($this->items ?? [])
            ->map(function ($item) {
                return [
                    'product_id' => $item['product_id'] ?? null,
                    'quantity' => $item['quantity'] ?? null,
                    'cost_price' => $item['cost_price'] ?? null,
                ];
            })
            ->filter(function ($item) {
                return !empty($item['product_id']);
            })
            ->values()
            ->all();

        $this->merge([
            'invoice_no' => $this->invoice_no ?: null,
            'note' => $this->note ?: null,
            'items' => $items,
        ]);
    }
}
