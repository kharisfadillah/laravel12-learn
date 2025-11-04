<?php

namespace App\Http\Controllers;

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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name',
            'notes' => 'nullable|string|max:300',
        ]);

        Role::create($validated);

        return redirect()->route('role.index')->with('success', 'Role berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:roles,name,' . $id,
            'notes' => 'nullable|string|max:300',
        ]);

        $role->update($validated);

        return redirect()->route('role.index')->with('success', 'Role berhasil diubah.');
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return redirect()->route('role.index')->with('success', 'Role berhasil dihapus.');
    }
}
