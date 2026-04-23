<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Branch;
use App\Models\User;
use App\Services\User\UserService;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(protected UserService $userService)
    {
    }

    public function index()
    {
        $users = User::query()
            ->with(['branch', 'roles'])
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'branch' => $user->branch?->name,
                    'role' => $user->roles->pluck('name')->first(),
                    'is_active' => $user->is_active,
                ];
            });

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Users/Create', [
            'branches' => Branch::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'roles' => Role::query()
                ->orderBy('name')
                ->get(['name']),
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->create($request->validated());

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        $user->load(['roles', 'branch']);

        return Inertia::render('Users/Edit', [
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'branch_id' => $user->branch_id,
                'role' => $user->roles->pluck('name')->first(),
                'is_active' => $user->is_active,
            ],
            'branches' => Branch::query()
                ->orderBy('name')
                ->get(['id', 'name']),
            'roles' => Role::query()
                ->orderBy('name')
                ->get(['name']),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->userService->update($user, $request->validated());

        return redirect()
            ->route('users.index')
            ->with('success', 'User updated successfully.');
    }
}
