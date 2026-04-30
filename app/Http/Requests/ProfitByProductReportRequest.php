<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfitByProductReportRequest extends FormRequest
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
            'category_id' => ['nullable', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'search' => ['nullable', 'string', 'max:255'],
        ];
    }
}
