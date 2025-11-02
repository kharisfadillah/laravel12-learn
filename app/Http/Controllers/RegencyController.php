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
        return Inertia::render('regency/index', [
            // Ambil data provinsi (misalnya untuk combobox)
            'provinces' => Province::select('id', 'province_code', 'province_name')
                ->orderBy('province_name')
                ->get(),

            // Ambil daftar kabupaten/kota
            'regencies' => Regency::select('id', 'province_id', 'regency_code', 'regency_name')
                ->with('province:id,province_name') // jika ada relasi
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
        return Inertia::render('regency/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'province_id' => 'required',
            'regency_code' => 'required|string|max:10|unique:regencies,regency_code',
            'regency_name' => 'required|string|max:100',
        ]);

        Regency::create($validated);

        return redirect()->route('regency.index')->with('success', 'Kabupaten berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $regency = Regency::findOrFail($id);

        $validated = $request->validate([
            'province_id' => 'required',
            'regency_code' => 'required|string|max:10|unique:regencies,regency_code,' . $id,
            'regency_name' => 'required|string|max:100',
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
