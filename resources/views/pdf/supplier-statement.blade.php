<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Supplier Statement</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 14px;
            margin-top: 5px;
        }

        .period {
            margin-top: 4px;
            font-size: 11px;
            color: #444;
        }

        .summary {
            width: 100%;
            margin-bottom: 20px;
        }

        .summary td {
            border: 1px solid #333;
            padding: 8px;
            text-align: center;
        }

        .summary .label {
            font-weight: bold;
            background: #f2f2f2;
        }

        table.statement {
            width: 100%;
            border-collapse: collapse;
        }

        table.statement th,
        table.statement td {
            border: 1px solid #333;
            padding: 6px;
        }

        table.statement th {
            background: #f2f2f2;
            font-weight: bold;
        }

        .right {
            text-align: right;
        }

        .center {
            text-align: center;
        }

        .details {
            margin-bottom: 15px;
        }

        .footer {
            margin-top: 25px;
            font-size: 10px;
            text-align: center;
            color: #555;
        }
    </style>
</head>

<body>
    @php
        $supplier = $statement['supplier'];
        $transactions = $statement['transactions'];
        $summary = $statement['summary'];
        $filters = $statement['filters'] ?? [];

        $money = fn ($amount) => 'Rs. ' . number_format((float) $amount, 2);
    @endphp

    <div class="header">
        <div class="title">Supplier Statement</div>
        <div class="subtitle">{{ $supplier->name }}</div>
        <div>Generated: {{ now()->format('Y-m-d H:i') }}</div>

        @if(!empty($filters['from']) || !empty($filters['to']))
            <div class="period">
                Period:
                {{ $filters['from'] ?? 'Beginning' }}
                to
                {{ $filters['to'] ?? 'Today' }}
            </div>
        @endif
    </div>

    <div class="details">
        <strong>Supplier:</strong> {{ $supplier->name }}<br>
        <strong>Phone:</strong> {{ $supplier->phone ?? '-' }}<br>
        <strong>Email:</strong> {{ $supplier->email ?? '-' }}
    </div>

    <table class="summary">
        <tr>
            <td class="label">Total Purchases</td>
            <td class="label">Paid / Returned</td>
            <td class="label">Outstanding Payable</td>
        </tr>
        <tr>
            <td>{{ $money($summary['total_purchases']) }}</td>
            <td>{{ $money($summary['total_paid_or_returned']) }}</td>
            <td>{{ $money($summary['outstanding']) }}</td>
        </tr>
    </table>

    <table class="statement">
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Reference</th>
                <th>Description</th>
                <th class="right">Paid / Return</th>
                <th class="right">Purchase</th>
                <th class="right">Balance</th>
            </tr>
        </thead>

        <tbody>
            @forelse($transactions as $item)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($item['date'])->format('Y-m-d') }}</td>
                    <td>{{ $item['type'] }}</td>
                    <td>{{ $item['reference'] }}</td>
                    <td>{{ $item['description'] ?? '-' }}</td>
                    <td class="right">
                        {{ $item['debit'] > 0 ? $money($item['debit']) : '-' }}
                    </td>
                    <td class="right">
                        {{ $item['credit'] > 0 ? $money($item['credit']) : '-' }}
                    </td>
                    <td class="right">
                        {{ $money($item['balance']) }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="center">
                        No statement records found.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        This is a system-generated supplier statement.
    </div>
</body>
</html>
