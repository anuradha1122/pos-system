<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDailyClosingRequest;
use App\Http\Requests\UpdateDailyClosingRequest;
use App\Models\DailyClosing;
use App\Services\DailyClosing\DailyClosingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DailyClosingController extends Controller
{
    public function __construct(
        protected DailyClosingService $dailyClosingService
    ) {
    }

    public function index(Request $request): Response
    {
        $from = $request->input('from');
        $to = $request->input('to');

        $closings = DailyClosing::query()
            ->with(['branch:id,name', 'creator:id,name', 'finalizer:id,name'])
            ->where('branch_id', auth()->user()->branch_id)
            ->when($from, function ($query) use ($from) {
                $query->whereDate('closing_date', '>=', $from);
            })
            ->when($to, function ($query) use ($to) {
                $query->whereDate('closing_date', '<=', $to);
            })
            ->latest('closing_date')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('DailyClosings/Index', [
            'closings' => $closings,
            'filters' => [
                'from' => $from,
                'to' => $to,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $date = $request->input('closing_date', now()->toDateString());
        $openingBalance = (float) $request->input('opening_balance', 0);
        $countedCash = (float) $request->input('counted_cash', 0);

        $calculated = $this->dailyClosingService->calculate(
            $date,
            $openingBalance,
            $countedCash
        );

        return Inertia::render('DailyClosings/Create', [
            'defaultDate' => $date,
            'calculated' => $calculated,
        ]);
    }

    public function store(StoreDailyClosingRequest $request): RedirectResponse
    {
        $this->dailyClosingService->create($request->validated());

        return redirect()
            ->route('daily-closings.index')
            ->with('success', 'Daily closing completed successfully.');
    }

    public function show(DailyClosing $dailyClosing): Response
    {
        abort_if(
            $dailyClosing->branch_id !== auth()->user()->branch_id,
            403
        );

        $dailyClosing->load(['branch:id,name', 'creator:id,name', 'finalizer:id,name']);

        return Inertia::render('DailyClosings/Show', [
            'closing' => $dailyClosing,
        ]);
    }

    public function edit(DailyClosing $dailyClosing): Response
    {
        abort_if(
            $dailyClosing->branch_id !== auth()->user()->branch_id,
            403
        );

        abort_if(
            $dailyClosing->isFinalized(),
            403,
            'Finalized daily closing cannot be edited.'
        );

        return Inertia::render('DailyClosings/Edit', [
            'closing' => $dailyClosing,
        ]);
    }

    public function update(UpdateDailyClosingRequest $request, DailyClosing $dailyClosing): RedirectResponse
    {
        abort_if(
            $dailyClosing->branch_id !== auth()->user()->branch_id,
            403
        );

        $this->dailyClosingService->update($dailyClosing, $request->validated());

        return redirect()
            ->route('daily-closings.show', $dailyClosing->id)
            ->with('success', 'Daily closing updated successfully.');
    }

    public function finalize(DailyClosing $dailyClosing): RedirectResponse
    {
        abort_if(
            $dailyClosing->branch_id !== auth()->user()->branch_id,
            403
        );

        $this->dailyClosingService->finalize($dailyClosing);

        return redirect()
            ->route('daily-closings.show', $dailyClosing->id)
            ->with('success', 'Daily closing finalized successfully.');
    }
}
