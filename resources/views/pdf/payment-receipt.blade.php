<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Receipt</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #111;
        }

        .center {
            text-align: center;
        }

        .logo {
            max-height: 70px;
            margin-bottom: 8px;
        }

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        .subtitle {
            font-size: 15px;
            font-weight: bold;
            margin-top: 15px;
            text-transform: uppercase;
        }

        .line {
            border-top: 1px solid #333;
            margin: 15px 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            padding: 6px 4px;
            vertical-align: top;
        }

        .label {
            font-weight: bold;
            width: 35%;
        }

        .amount-box {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #333;
            text-align: center;
        }

        .amount {
            font-size: 24px;
            font-weight: bold;
        }

        .signatures {
            margin-top: 50px;
            width: 100%;
        }

        .signature-line {
            border-top: 1px solid #333;
            text-align: center;
            padding-top: 5px;
        }

        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #555;
        }
    </style>
</head>

<body>
    <div class="center">
        @if($company && $company->logo)
            <img
                src="{{ public_path('storage/' . $company->logo) }}"
                class="logo"
            >
        @endif

        <div class="title">
            {{ $company->company_name ?? 'Company Name' }}
        </div>

        <div>
            {{ $company->address ?? '-' }}
        </div>

        <div>
            {{ $company->phone ?? '-' }} | {{ $company->email ?? '-' }}
        </div>
    </div>

    <div class="line"></div>

    <div class="center">
        <div class="subtitle">Payment Receipt</div>
        <div>Receipt No: {{ $receiptNo }}</div>
    </div>

    <br>

    @php
        $partyName = $payment->customer->name ?? $payment->supplier->name ?? 'Walk-in / General';
        $partyPhone = $payment->customer->phone ?? $payment->supplier->phone ?? '-';
    @endphp

    <table>
        <tr>
            <td class="label">Payment Date</td>
            <td>{{ $payment->payment_date }}</td>
        </tr>

        <tr>
            <td class="label">Branch</td>
            <td>{{ $payment->branch->name ?? '-' }}</td>
        </tr>

        <tr>
            <td class="label">Party</td>
            <td>{{ $partyName }}</td>
        </tr>

        <tr>
            <td class="label">Phone</td>
            <td>{{ $partyPhone }}</td>
        </tr>

        <tr>
            <td class="label">Payment Type</td>
            <td>{{ ucwords(str_replace('_', ' ', $payment->payment_type)) }}</td>
        </tr>

        <tr>
            <td class="label">Payment Method</td>
            <td>{{ ucwords(str_replace('_', ' ', $payment->payment_method)) }}</td>
        </tr>

        <tr>
            <td class="label">Reference No</td>
            <td>{{ $payment->reference_no ?? '-' }}</td>
        </tr>

        <tr>
            <td class="label">Created By</td>
            <td>{{ $payment->creator->name ?? '-' }}</td>
        </tr>

        @if($payment->note)
            <tr>
                <td class="label">Note</td>
                <td>{{ $payment->note }}</td>
            </tr>
        @endif
    </table>

    <div class="amount-box">
        <div>Amount</div>
        <div class="amount">
            Rs. {{ number_format($payment->amount, 2) }}
        </div>
    </div>

    <table class="signatures">
        <tr>
            <td style="width: 45%;">
                <div class="signature-line">Received By</div>
            </td>

            <td style="width: 10%;"></td>

            <td style="width: 45%;">
                <div class="signature-line">Customer / Supplier Signature</div>
            </td>
        </tr>
    </table>

    @if($company && $company->receipt_footer)
        <div class="footer">
            {{ $company->receipt_footer }}
        </div>
    @endif
</body>
</html>
