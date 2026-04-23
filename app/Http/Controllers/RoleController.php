<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Services\Role\RoleService;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(protected RoleService $roleService)
    {
    }

    public function index()
    {
        $roles = Role::query()
            ->with('permissions')
            ->latest()
            ->get()
            ->map(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions_count' => $role->permissions->count(),
                ];
            });

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $permissionGroups = $this->getPermissionGroups();

        return Inertia::render('Roles/Create', [
            'permissionGroups' => $permissionGroups,
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->roleService->create($request->validated());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role)
    {
        $role->load('permissions');

        $permissionGroups = $this->getPermissionGroups();

        return Inertia::render('Roles/Edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->pluck('name')->values(),
            ],
            'permissionGroups' => $permissionGroups,
        ]);
    }

    public function update(UpdateRoleRequest $request, Role $role)
    {
        $this->roleService->update($role, $request->validated());

        return redirect()
            ->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    protected function getPermissionGroups()
    {
        return Permission::query()
            ->orderBy('name')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            })
            ->map(function ($groupPermissions, $groupName) {
                return [
                    'group' => ucfirst($groupName),
                    'permissions' => $groupPermissions->map(function ($permission) {
                        return [
                            'name' => $permission->name,
                            'label' => $permission->name,
                        ];
                    })->values(),
                ];
            })
            ->values();
    }
}
