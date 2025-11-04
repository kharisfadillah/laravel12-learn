<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    public function index(): Response
    {
        $permissions = Permission::select('id', 'name', 'notes')->get();

        return Inertia::render('Permission/Index', [
            'permissions' => $permissions,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:permissions,name',
            'notes' => 'nullable|string|max:300',
        ]);

        Permission::create($validated);

        return redirect()->route('permission.index')->with('success', 'Hak akses berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:permissions,name,' . $id,
            'notes' => 'nullable|string|max:300',
        ]);

        $permission->update($validated);

        return redirect()->route('permission.index')->with('success', 'Hak akses berhasil diubah.');
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return redirect()->route('permission.index')->with('success', 'Hak akses berhasil dihapus.');
    }
}
