<?php

namespace App\Http\Controllers;

use App\Models\MCUCategory;
use App\Models\MCUParameter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MCUParameterController extends Controller
{
    public function index(Request $request): Response
    {

        $search = $request->input('search');

        $mcuparameters = MCUParameter::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MCUParameter/Index', [
            'mcuparameters' => $mcuparameters,
            'filters' => [
                'search' => $search,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create(): Response
    {

        $mcucategories = MCUCategory::query()
            ->select('id', 'name')
            ->get();

        $inputtypes = [
            'Angka',
            'Teks Bebas',
            'Pilihan',
        ];

        return Inertia::render('MCUParameter/Create', [
            'mcucategories' => $mcucategories,
            'inputtypes' => $inputtypes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:mcu_categories,name',
        ]);

        MCUParameter::create($validated);

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $mcuparameter = MCUParameter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:mcu_categories,name,' . $id,
        ]);

        $mcuparameter->update($validated);

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil diubah.');
    }

    public function destroy($id)
    {
        $mcuparameter = MCUParameter::findOrFail($id);
        $mcuparameter->delete();

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil dihapus.');
    }
}
