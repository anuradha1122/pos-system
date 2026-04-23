<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use App\Services\Unit\UnitService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    public function __construct(protected UnitService $unitService)
    {
    }

    public function index(): Response
    {
        $units = Unit::query()
            ->latest()
            ->get()
            ->map(function ($unit) {
                return [
                    'id' => $unit->id,
                    'name' => $unit->name,
                    'short_name' => $unit->short_name,
                    'is_active' => $unit->is_active,
                    'created_at' => $unit->created_at?->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Units/Index', [
            'units' => $units,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Units/Create');
    }

    public function store(StoreUnitRequest $request): RedirectResponse
    {
        $this->unitService->create($request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit): Response
    {
        return Inertia::render('Units/Edit', [
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'short_name' => $unit->short_name,
                'is_active' => $unit->is_active,
            ],
        ]);
    }

    public function update(UpdateUnitRequest $request, Unit $unit): RedirectResponse
    {
        $this->unitService->update($unit, $request->validated());

        return redirect()
            ->route('units.index')
            ->with('success', 'Unit updated successfully.');
    }
}
