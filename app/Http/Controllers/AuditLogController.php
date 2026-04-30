<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $module = $request->input('module');
        $action = $request->input('action');

        $logs = AuditLog::query()
            ->with(['user:id,name', 'branch:id,name'])
            ->when(auth()->user()->branch_id, function ($query) {
                $query->where('branch_id', auth()->user()->branch_id);
            })
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('module', 'like', "%{$search}%")
                        ->orWhere('action', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search) {
                            $userQuery->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($module, fn ($query) => $query->where('module', $module))
            ->when($action, fn ($query) => $query->where('action', $action))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search,
                'module' => $module,
                'action' => $action,
            ],
            'modules' => AuditLog::query()->distinct()->pluck('module')->values(),
            'actions' => AuditLog::query()->distinct()->pluck('action')->values(),
        ]);
    }

    public function show(AuditLog $auditLog): Response
    {
        abort_if(
            auth()->user()->branch_id && $auditLog->branch_id !== auth()->user()->branch_id,
            403
        );

        $auditLog->load(['user:id,name', 'branch:id,name']);

        return Inertia::render('AuditLogs/Show', [
            'log' => $auditLog,
        ]);
    }
}
