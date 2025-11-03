<?php

namespace App\Http\Controllers;

use App\Models\Province;
use App\Models\Regency;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegencyController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Regency/Index', [
            // Ambil data provinsi (misalnya untuk combobox)
            'provinces' => Province::select('id', 'code', 'name')
                ->orderBy('id')
                ->get(),

            // Ambil daftar kabupaten/kota
            'regencies' => Regency::select('id', 'province_id', 'code', 'name')
                ->with('province:id,name') // jika ada relasi
                ->latest()
                ->get(),

            // Flash message
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Regency/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'province_id' => 'required',
            'code' => 'required|string|max:10|unique:regencies,code',
            'name' => 'required|string|max:100',
        ]);

        Regency::create($validated);

        return redirect()->route('regency.index')->with('success', 'Kabupaten berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $regency = Regency::findOrFail($id);

        $validated = $request->validate([
            'province_id' => 'required',
            'code' => 'required|string|max:10|unique:regencies,code,' . $id,
            'name' => 'required|string|max:100',
        ]);

        $regency->update($validated);

        return redirect()->route('regency.index')->with('success', 'Kabupaten berhasil diubah.');
    }

    public function destroy($id)
    {
        $regency = Regency::findOrFail($id);
        $regency->delete();

        return redirect()->route('regency.index')->with('success', 'Kabupaten berhasil dihapus.');
    }
}
