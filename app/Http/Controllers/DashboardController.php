<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Branch;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Dashboard', [
            'stats' => [
                'branches' => Branch::count(),
                'users' => User::count(),
                'roles' => Role::count(),
            ],
        ]);
    }
}
