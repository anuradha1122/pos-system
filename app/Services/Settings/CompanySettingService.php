<?php

namespace App\Services\Settings;

use App\Models\CompanySetting;
use App\Services\AuditLog\AuditLogService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanySettingService
{
    public function __construct(
        protected AuditLogService $auditLogService
    ) {
    }

    public function get(): CompanySetting
    {
        return CompanySetting::firstOrCreate([], [
            'company_name' => 'POS System',
            'receipt_footer' => 'Thank you for your business.',

            'invoice_prefix' => 'INV',
            'purchase_prefix' => 'PUR',
            'receipt_width' => '80mm',
            'low_stock_threshold' => 5,

            'allow_credit_sales' => true,
            'enable_daily_closing' => true,
            'prevent_sale_after_closing' => false,
            'prevent_expense_after_closing' => false,
        ]);
    }

    public function update(array $data): CompanySetting
    {
        return DB::transaction(function () use ($data) {
            $setting = $this->get();

            $oldValues = $setting->toArray();

            $logoPath = $setting->logo;

            if (isset($data['logo']) && $data['logo'] instanceof UploadedFile) {
                if ($setting->logo && Storage::disk('public')->exists($setting->logo)) {
                    Storage::disk('public')->delete($setting->logo);
                }

                $logoPath = $data['logo']->store('company', 'public');
            }

            $setting->update([
                'company_name' => $data['company_name'],
                'address' => $data['address'] ?? null,
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'] ?? null,
                'receipt_footer' => $data['receipt_footer'] ?? null,
                'logo' => $logoPath,

                'invoice_prefix' => $data['invoice_prefix'],
                'purchase_prefix' => $data['purchase_prefix'],
                'receipt_width' => $data['receipt_width'],
                'low_stock_threshold' => $data['low_stock_threshold'],

                'allow_credit_sales' => $data['allow_credit_sales'],
                'enable_daily_closing' => $data['enable_daily_closing'],
                'prevent_sale_after_closing' => $data['prevent_sale_after_closing'],
                'prevent_expense_after_closing' => $data['prevent_expense_after_closing'],

                'updated_by' => Auth::id(),
            ]);

            $setting->refresh();

            $this->auditLogService->log(
                action: 'updated',
                module: 'company-settings',
                auditable: $setting,
                oldValues: $oldValues,
                newValues: $setting->toArray()
            );

            return $setting;
        });
    }
}
