<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use App\Services\Product\ProductService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(protected ProductService $productService)
    {
    }

    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $categoryId = $request->string('category_id')->toString();

        $products = Product::query()
            ->with(['category:id,name', 'brand:id,name', 'unit:id,name'])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($subQuery) use ($search) {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', function ($query) use ($status) {
                if ($status === 'active') {
                    $query->where('is_active', true);
                }

                if ($status === 'inactive') {
                    $query->where('is_active', false);
                }
            })
            ->when($categoryId !== '', function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'barcode' => $product->barcode,
                    'cost_price' => $product->cost_price,
                    'selling_price' => $product->selling_price,
                    'reorder_level' => $product->reorder_level,
                    'is_active' => $product->is_active,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                    'brand' => $product->brand ? [
                        'id' => $product->brand->id,
                        'name' => $product->brand->name,
                    ] : null,
                    'unit' => $product->unit ? [
                        'id' => $product->unit->id,
                        'name' => $product->unit->name,
                    ] : null,
                ];
            });

        return Inertia::render('Products/Index', [
            'filters' => [
                'search' => $search,
                'status' => $status,
                'category_id' => $categoryId,
            ],
            'products' => $products,
            'categories' => Category::query()
                ->select('id', 'name')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Products/Create', $this->formData());
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->productService->create($request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Products/Edit', array_merge(
            $this->formData(),
            [
                'product' => [
                    'id' => $product->id,
                    'category_id' => $product->category_id,
                    'brand_id' => $product->brand_id,
                    'unit_id' => $product->unit_id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'barcode' => $product->barcode,
                    'description' => $product->description,
                    'cost_price' => $product->cost_price,
                    'selling_price' => $product->selling_price,
                    'reorder_level' => $product->reorder_level,
                    'is_active' => $product->is_active,
                ],
            ]
        ));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->productService->update($product, $request->validated());

        return redirect()
            ->route('products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function toggleStatus(Product $product): RedirectResponse
    {
        $this->productService->toggleStatus($product);

        return redirect()
            ->route('products.index')
            ->with('success', 'Product status updated successfully.');
    }

    protected function formData(): array
    {
        return [
            'categories' => Category::query()->select('id', 'name')->orderBy('name')->get(),
            'brands' => Brand::query()->select('id', 'name')->orderBy('name')->get(),
            'units' => Unit::query()->select('id', 'name')->orderBy('name')->get(),
        ];
    }
}
