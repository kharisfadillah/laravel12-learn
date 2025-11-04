<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    public function index(): Response
    {
        $roles = Role::select('id', 'name', 'notes')->get();

        return Inertia::render('Role/Index', [
            'roles' => $roles,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create(): Response
    {
        $permissions = Permission::select('id', 'name', 'notes')->get();

        return Inertia::render('Role/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name',
            'notes' => 'nullable|string|max:300',
            'permissions' => 'array',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'notes' => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('role.index')->with('success', 'Role berhasil ditambahkan.');
    }

    public function edit($id): Response
    {
        $role = Role::with('permissions:id')->findOrFail($id);
        $permissions = Permission::select('id', 'name', 'notes')->get();

        return Inertia::render('Role/Edit', [
            'role' => $role,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name,' . $id,
            'notes' => 'nullable|string|max:300',
            'permissions' => 'array',
        ]);

        $role->update([
            'name' => $validated['name'],
            'notes' => $validated['notes'] ?? null,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        } else {
            $role->permissions()->detach();
        }

        return redirect()->route('role.index')->with('success', 'Role berhasil diubah.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('role.index')->with('success', 'Role berhasil dihapus.');
    }
}
