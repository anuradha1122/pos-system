<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:units,name'],
            'short_name' => ['required', 'string', 'max:50', 'unique:units,short_name'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
