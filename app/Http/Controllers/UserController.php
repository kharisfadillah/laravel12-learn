<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'username', 'name', 'email')
            ->latest()
            ->get();

        return Inertia::render('User/Index', [
            'users' => $users,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('User/Create', [
            'roles' => Role::select('id', 'name')->get(),
            'companies' => Company::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:100|unique:users,username',
            'name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:300',
            'roles' => 'array',
            'companies' => 'array',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'username' => $validated['username'],
                'name' => isset($validated['name']) ? strtoupper($validated['name']) : null,
                'email' => $validated['email'] ?? null,
                'password' => Hash::make('Jhonlin@123'),
            ]);

            if (!empty($validated['roles']) && !empty($validated['companies'])) {
                foreach ($validated['roles'] as $roleId) {
                    foreach ($validated['companies'] as $companyId) {
                        DB::table('user_role_company')->insert([
                            'user_id' => $user->id,
                            'role_id' => $roleId,
                            'company_id' => $companyId,
                        ]);
                    }
                }
            }
        });

        return redirect()->route('user.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        $userRoleCompanies = DB::table('user_role_company')
            ->where('user_id', $user->id)
            ->pluck('role_id', 'company_id');

        return Inertia::render('User/Edit', [
            'user' => $user,
            'roles' => Role::select('id', 'name')->get(),
            'companies' => Company::select('id', 'name')->get(),
            'userRoleCompanies' => $userRoleCompanies,
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:100|unique:users,username,' . $user->id,
            'name' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:300',
            'roles' => 'array',
            'companies' => 'array',
        ]);

        DB::transaction(function () use ($user, $validated) {
            $user->update([
                'username' => strtoupper($validated['username']),
                'name' => isset($validated['name']) ? strtoupper($validated['name']) : null,
                'email' => $validated['email'] ?? null,
            ]);

            DB::table('user_role_company')->where('user_id', $user->id)->delete();

            if (!empty($validated['roles']) && !empty($validated['companies'])) {
                foreach ($validated['roles'] as $roleId) {
                    foreach ($validated['companies'] as $companyId) {
                        DB::table('user_role_company')->insert([
                            'user_id' => $user->id,
                            'role_id' => $roleId,
                            'company_id' => $companyId,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        });

        return redirect()->route('user.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        DB::transaction(function () use ($user) {
            DB::table('user_role_company')->where('user_id', $user->id)->delete();
            $user->delete();
        });

        return redirect()->route('user.index')->with('success', 'User berhasil dihapus.');
    }
}
