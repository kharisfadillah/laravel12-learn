<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\MCUIHeader;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MCUController extends Controller
{
    public function index(Request $request): Response
    {
        // $provinces = Province::select('id', 'code', 'name')->get();

        // return Inertia::render('Province/Index', [
        //     'provinces' => $provinces,
        //     'flash' => [
        //         'success' => session('success'),
        //         'error' => session('error')
        //     ]
        // ]);

        $search = $request->input('search');

        $mcus = MCUIHeader::query()
            ->with('company:id,name')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MCU/Index', [
            'mcus' => $mcus,
            'filters' => [
                'search' => $search,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create()
    {
        $companies = Company::select('id', 'name')->get();
        // $departments = Department::select('id', 'name', 'company_id')->get();

        return Inertia::render('MCU/Create', [
            'companies' => $companies,
            // 'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:provinces,code',
            'name' => 'required|string|max:100',
        ]);

        Province::create($validated);

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:provinces,code,' . $id,
            'name' => 'required|string|max:100',
        ]);

        $province->update($validated);

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil diubah.');
    }

    public function destroy($id)
    {
        $province = Province::findOrFail($id);
        $province->delete();

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil dihapus.');
    }
}
