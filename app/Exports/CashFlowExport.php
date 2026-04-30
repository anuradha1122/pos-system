<?php

namespace App\Exports;

use App\Models\Payment;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CashFlowExport implements FromCollection, WithHeadings
{
    protected $filters;

    public function __construct($filters)
    {
        $this->filters = $filters;
    }

    public function collection(): Collection
    {
        return Payment::query()
            ->with(['branch', 'creator'])
            ->when($this->filters['from_date'] ?? null, fn($q, $d) =>
                $q->whereDate('created_at', '>=', $d)
            )
            ->when($this->filters['to_date'] ?? null, fn($q, $d) =>
                $q->whereDate('created_at', '<=', $d)
            )
            ->when($this->filters['branch_id'] ?? null, fn($q, $id) =>
                $q->where('branch_id', $id)
            )
            ->get()
            ->map(function ($p) {
                return [
                    'Date' => $p->created_at->format('Y-m-d'),
                    'Reference' => $p->reference_type . ' #' . $p->reference_id,
                    'Type' => strtoupper($p->type),
                    'Method' => strtoupper($p->method),
                    'Amount' => $p->amount,
                    'Branch' => $p->branch->name ?? '-',
                    'User' => $p->creator->name ?? '-',
                    'Note' => $p->note,
                ];
            });
    }

    public function headings(): array
    {
        return [
            'Date',
            'Reference',
            'Type',
            'Method',
            'Amount',
            'Branch',
            'User',
            'Note',
        ];
    }
}
