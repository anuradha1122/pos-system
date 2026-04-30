<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\User;
use App\Services\Dashboard\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {
    }

    public function index(Request $request): Response
    {
        $filters = [
            'from' => $request->input('from', now()->toDateString()),
            'to' => $request->input('to', now()->toDateString()),
        ];

        $dashboardData = $this->dashboardService->getDashboardData($filters);

        return Inertia::render('Dashboard', [
            'filters' => $filters,
            'stats' => [
                'branches' => Branch::count(),
                'users' => User::count(),
                'roles' => Role::count(),
            ],
            'summary' => $dashboardData['summary'],
            'cashFlowLast7Days' => $dashboardData['cash_flow_last_7_days'],
            'methodBreakdown' => $dashboardData['method_breakdown'],
            'quickLinks' => $dashboardData['quick_links'],
        ]);
    }
}
