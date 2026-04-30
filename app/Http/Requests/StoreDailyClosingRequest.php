<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyClosingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()?->can('daily-closing.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'closing_date' => ['required', 'date'],
            'opening_balance' => ['required', 'numeric', 'min:0'],
            'counted_cash' => ['required', 'numeric', 'min:0'],
            'note' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
