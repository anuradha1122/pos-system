<?php

namespace App\Services\User;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class UserService
{
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'branch_id' => $data['branch_id'],
                'is_active' => $data['is_active'] ?? true,
            ]);

            $user->syncRoles([$data['role']]);

            return $user->load('branch');
        });
    }

    public function update(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $updateData = [
                'name' => $data['name'],
                'email' => $data['email'],
                'branch_id' => $data['branch_id'],
                'is_active' => $data['is_active'] ?? true,
            ];

            if (!empty($data['password'])) {
                $updateData['password'] = $data['password'];
            }

            $user->update($updateData);

            $user->syncRoles([$data['role']]);

            return $user->load('branch');
        });
    }
}
