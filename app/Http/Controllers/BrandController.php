<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBrandRequest;
use App\Http\Requests\UpdateBrandRequest;
use App\Models\Brand;
use App\Services\Brand\BrandService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function __construct(protected BrandService $brandService)
    {
    }

    public function index(): Response
    {
        $brands = Brand::query()
            ->latest()
            ->get()
            ->map(function ($brand) {
                return [
                    'id' => $brand->id,
                    'name' => $brand->name,
                    'code' => $brand->code,
                    'is_active' => $brand->is_active,
                    'created_at' => $brand->created_at?->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Brands/Index', [
            'brands' => $brands,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Brands/Create');
    }

    public function store(StoreBrandRequest $request): RedirectResponse
    {
        $this->brandService->create($request->validated());

        return redirect()
            ->route('brands.index')
            ->with('success', 'Brand created successfully.');
    }

    public function edit(Brand $brand): Response
    {
        return Inertia::render('Brands/Edit', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'code' => $brand->code,
                'is_active' => $brand->is_active,
            ],
        ]);
    }

    public function update(UpdateBrandRequest $request, Brand $brand): RedirectResponse
    {
        $this->brandService->update($brand, $request->validated());

        return redirect()
            ->route('brands.index')
            ->with('success', 'Brand updated successfully.');
    }
}
