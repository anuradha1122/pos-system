<?php

namespace App\Http\Controllers;

use App\Services\Settings\CompanySettingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanySettingController extends Controller
{
    public function __construct(
        protected CompanySettingService $companySettingService
    ) {
    }

    public function edit(): Response
    {
        $setting = $this->companySettingService->get();

        return Inertia::render('CompanySettings/Edit', [
            'setting' => [
                'company_name' => $setting->company_name,
                'address' => $setting->address,
                'phone' => $setting->phone,
                'email' => $setting->email,
                'receipt_footer' => $setting->receipt_footer,
                'logo' => $setting->logo,
                'logo_url' => $setting->logo ? asset('storage/' . $setting->logo) : null,

                'invoice_prefix' => $setting->invoice_prefix,
                'purchase_prefix' => $setting->purchase_prefix,
                'receipt_width' => $setting->receipt_width,
                'low_stock_threshold' => $setting->low_stock_threshold,

                'allow_credit_sales' => $setting->allow_credit_sales,
                'enable_daily_closing' => $setting->enable_daily_closing,
                'prevent_sale_after_closing' => $setting->prevent_sale_after_closing,
                'prevent_expense_after_closing' => $setting->prevent_expense_after_closing,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'receipt_footer' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

            'invoice_prefix' => ['required', 'string', 'max:20'],
            'purchase_prefix' => ['required', 'string', 'max:20'],
            'receipt_width' => ['required', 'string', 'max:20'],
            'low_stock_threshold' => ['required', 'numeric', 'min:0'],

            'allow_credit_sales' => ['required', 'boolean'],
            'enable_daily_closing' => ['required', 'boolean'],
            'prevent_sale_after_closing' => ['required', 'boolean'],
            'prevent_expense_after_closing' => ['required', 'boolean'],
        ]);

        $this->companySettingService->update($data);

        return redirect()
            ->route('company-settings.edit')
            ->with('success', 'Company settings updated successfully.');
    }
}
