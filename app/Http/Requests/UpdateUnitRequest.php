<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $unit = $this->route('unit');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('units', 'name')->ignore($unit->id),
            ],
            'short_name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('units', 'short_name')->ignore($unit->id),
            ],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
