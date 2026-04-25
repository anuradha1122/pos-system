<?php

namespace App\Exports;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SalesReportExport implements FromCollection, WithHeadings
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        $dateFrom = $this->filters['date_from'] ?? null;
        $dateTo = $this->filters['date_to'] ?? null;
        $customerId = $this->filters['customer_id'] ?? null;
        $branchId = $this->filters['branch_id'] ?? null;

        return DB::table('sale_headers')
            ->leftJoin('customers', 'sale_headers.customer_id', '=', 'customers.id')
            ->leftJoin('branches', 'sale_headers.branch_id', '=', 'branches.id')
            ->leftJoin('users', 'sale_headers.created_by', '=', 'users.id')
            ->when($dateFrom, fn ($q) => $q->whereDate('sale_headers.sale_date', '>=', $dateFrom))
            ->when($dateTo, fn ($q) => $q->whereDate('sale_headers.sale_date', '<=', $dateTo))
            ->when($customerId, fn ($q) => $q->where('sale_headers.customer_id', $customerId))
            ->when($branchId, fn ($q) => $q->where('sale_headers.branch_id', $branchId))
            ->orderByDesc('sale_headers.sale_date')
            ->orderByDesc('sale_headers.id')
            ->select([
                'sale_headers.sale_date',
                'sale_headers.invoice_no',
                'customers.name as customer',
                'branches.name as branch',
                'users.name as cashier',
                'sale_headers.grand_total',
            ])
            ->get()
            ->map(function ($row) {
                return [
                    $row->sale_date,
                    $row->invoice_no,
                    $row->customer ?? 'Walk-in',
                    $row->branch ?? '-',
                    $row->cashier ?? '-',
                    (float) $row->grand_total,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Date',
            'Invoice',
            'Customer',
            'Branch',
            'Cashier',
            'Total Amount',
        ];
    }
}
