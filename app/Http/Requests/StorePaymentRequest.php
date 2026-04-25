<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference_type' => ['required', 'string'],
            'reference_id' => ['required', 'integer'],
            'branch_id' => ['required', 'exists:branches,id'],
            'type' => ['required', 'in:in,out'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'in:cash,card,bank,credit'],
            'note' => ['nullable', 'string'],
        ];
    }
}
