<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\StoreBranchRequest;
use App\Http\Requests\UpdateBranchRequest;
use App\Services\Branch\BranchService;
use Illuminate\Http\RedirectResponse;

class BranchController extends Controller
{
    public function __construct(
        protected BranchService $branchService
    ) {}

    public function index(): Response
    {
        $branches = Branch::query()
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Branches/Create');
    }

    public function store(StoreBranchRequest $request): RedirectResponse
    {
        $this->branchService->create($request->validated());

        return redirect()
            ->route('branches.index')
            ->with('success', 'Branch created successfully.');
    }

    public function edit(Branch $branch): Response
    {
        return Inertia::render('Branches/Edit', [
            'branch' => $branch,
        ]);
    }

    public function update(UpdateBranchRequest $request, Branch $branch): RedirectResponse
    {
        $this->branchService->update($branch, $request->validated());

        return redirect()
            ->route('branches.index')
            ->with('success', 'Branch updated successfully.');
    }
}
