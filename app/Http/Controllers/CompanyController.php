<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(): Response
    {
        $companies = Company::select('id', 'code', 'name')->get();

        return Inertia::render('Company/Index', [
            'companies' => $companies,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:companies,code',
            'name' => 'required|string|max:100',
        ]);

        Company::create($validated);

        return redirect()->route('company.index')->with('success', 'Unit usaha berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:companies,code,' . $id,
            'name' => 'required|string|max:100',
        ]);

        $company->update($validated);

        return redirect()->route('company.index')->with('success', 'Unit usaha berhasil diubah.');
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);
        $company->delete();

        return redirect()->route('company.index')->with('success', 'Unit usaha berhasil dihapus.');
    }
}
