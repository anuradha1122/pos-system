<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CashFlowReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'from_date' => ['nullable', 'date'],
            'to_date' => ['nullable', 'date', 'after_or_equal:from_date'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'method' => ['nullable', 'in:cash,card,bank,credit'],
            'type' => ['nullable', 'in:in,out'],
        ];
    }
}
