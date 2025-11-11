<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Department/Index', [
            'companies' => Company::select('id', 'code', 'name')
                ->orderBy('id')
                ->get(),

            'departments' => Department::select('id', 'company_id', 'code', 'name')
                ->with('company:id,name')
                ->latest()
                ->get(),

            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required',
            'code' => 'required|string|max:20|unique:departments,code',
            'name' => 'required|string|max:150',
        ]);

        Department::create($validated);

        return redirect()->route('company.index')->with('success', 'Departemen berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:departments,code,' . $id,
            'name' => 'required|string|max:100',
        ]);

        $department->update($validated);

        return redirect()->route('department.index')->with('success', 'Departemen berhasil diubah.');
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return redirect()->route('department.index')->with('success', 'Departemen berhasil dihapus.');
    }
}
