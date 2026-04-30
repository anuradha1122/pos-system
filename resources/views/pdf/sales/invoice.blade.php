<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
            height: 60px;
            margin-bottom: 10px;
        }

        .title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .section {
            margin-bottom: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            padding: 6px;
            border: 1px solid #ccc;
        }

        th {
            background: #f5f5f5;
        }

        .right {
            text-align: right;
        }

        .totals {
            margin-top: 10px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
        }
    </style>
</head>

<body>

    <div class="header">
        @if($company['logo'])
            <img src="{{ public_path('storage/' . $company['logo']) }}" class="logo">
        @endif

        <div class="title">{{ $company['name'] }}</div>

        <div>{{ $company['address'] }}</div>
        <div>{{ $company['phone'] }}</div>
        <div>{{ $company['email'] }}</div>
    </div>

    <div class="section">
        <strong>Invoice:</strong> {{ $sale->invoice_no }} <br>
        <strong>Date:</strong> {{ $sale->sale_date }} <br>

        @if($sale->customer)
            <strong>Customer:</strong> {{ $sale->customer->name }}
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th class="right">Qty</th>
                <th class="right">Price</th>
                <th class="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sale->items as $item)
                <tr>
                    <td>{{ $item->product->name ?? '-' }}</td>
                    <td class="right">{{ number_format($item->quantity, 2) }}</td>
                    <td class="right">{{ number_format($item->unit_price, 2) }}</td>
                    <td class="right">
                        {{ number_format($item->quantity * $item->unit_price, 2) }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <table class="totals">
        <tr>
            <td>Subtotal</td>
            <td class="right">{{ number_format($totals['subtotal'], 2) }}</td>
        </tr>
        <tr>
            <td>Discount</td>
            <td class="right">{{ number_format($totals['discount'], 2) }}</td>
        </tr>
        <tr>
            <td>Tax</td>
            <td class="right">{{ number_format($totals['tax'], 2) }}</td>
        </tr>
        <tr>
            <td><strong>Total</strong></td>
            <td class="right"><strong>{{ number_format($totals['grand_total'], 2) }}</strong></td>
        </tr>
        <tr>
            <td>Paid</td>
            <td class="right">{{ number_format($totals['paid_amount'], 2) }}</td>
        </tr>
        <tr>
            <td>Balance</td>
            <td class="right">{{ number_format($totals['balance_amount'], 2) }}</td>
        </tr>
    </table>

    <div class="footer">
        {{ $company['receipt_footer'] }}
    </div>

</body>
</html>
