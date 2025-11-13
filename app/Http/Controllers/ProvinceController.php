<?php

namespace App\Http\Controllers;

use App\Models\Province;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProvinceController extends Controller
{
    public function index(): Response
    {
        $provinces = Province::select('id', 'code', 'name')->get();

        return Inertia::render('Province/Index', [
            'provinces' => $provinces,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
        
    }

    public function create()
    {
        return Inertia::render('Province/Create');
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
