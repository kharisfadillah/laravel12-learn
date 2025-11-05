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
            'role_company' => 'required|array|min:1',
            'role_company.*.role_id' => 'required|string|distinct',
            'role_company.*.company_id' => 'required|string|distinct',
        ]);

        $combinations = collect($request->role_company)
            ->map(fn($rc) => $rc['role_id'] . '-' . $rc['company_id']);

        if ($combinations->duplicates()->isNotEmpty()) {
            return back()->withErrors(['role_company' => 'Terdapat kombinasi Role dan Company yang sama.'])->withInput();
        }

        DB::transaction(function () use ($validated) {
            // Buat user baru
            $user = User::create([
                'username' => $validated['username'],
                'name' => isset($validated['name']) ? strtoupper($validated['name']) : null,
                'email' => $validated['email'] ?? null,
                'password' => Hash::make('Jhonlin@123'),
            ]);

            // Simpan data ke tabel pivot user_role_company
            foreach ($validated['role_company'] as $rc) {
                DB::table('user_role_company')->insert([
                    'user_id' => $user->id,
                    'role_id' => $rc['role_id'],
                    'company_id' => $rc['company_id'],
                ]);
            }
        });

        return redirect()->route('user.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        $userRoleCompanies = DB::table('user_role_company')
            ->where('user_id', $user->id)
            ->select('role_id', 'company_id')
            ->get()
            ->map(function ($item) {
                return [
                    'role_id' => (string) $item->role_id,
                    'company_id' => (string) $item->company_id,
                ];
            });

        return Inertia::render('User/Edit', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'email' => $user->email,
                'role_company' => $userRoleCompanies,
            ],
            'roles' => Role::select('id', 'name')->get(),
            'companies' => Company::select('id', 'name')->get(),
        ]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role_company' => 'required|array|min:1',
            'role_company.*.role_id' => 'required|exists:roles,id',
            'role_company.*.company_id' => 'required|exists:companies,id',
        ]);

        $combinations = collect($request->role_company)
            ->map(fn($rc) => $rc['role_id'] . '-' . $rc['company_id']);

        if ($combinations->duplicates()->isNotEmpty()) {
            return back()->withErrors(['role_company' => 'Terdapat kombinasi Role dan Unit usaha yang sama.'])->withInput();
        }
        $user = User::findOrFail($id);

        DB::transaction(function () use ($user, $request) {
            $user->update([
                'username' => $request->username,
                'name' => $request->name,
                'email' => $request->email,
            ]);

            DB::table('user_role_company')->where('user_id', $user->id)->delete();

            foreach ($request->role_company as $rc) {
                DB::table('user_role_company')->insert([
                    'user_id' => $user->id,
                    'role_id' => $rc['role_id'],
                    'company_id' => $rc['company_id'],
                ]);
            }
        });

        return redirect()->route('user.index')->with('success', 'Pengguna berhasil diperbarui.');
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
