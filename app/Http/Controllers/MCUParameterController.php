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
            ->with('category:id,name')
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

    // public function store(Request $request)
    // {
    //     dd($request->all());
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:100|unique:mcu_categories,name',
    //     ]);

    //     MCUParameter::create($validated);

    //     return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil ditambahkan.');
    // }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => ['required', 'string'],
            'name'        => ['required', 'string', 'max:255'],
            'input_type'  => ['required', 'string', 'in:Angka,Teks Bebas,Pilihan'],

            // hanya validasi bentuk array, nanti detailnya disesuaikan
            'ranges'      => ['nullable', 'array'],
            'options'     => ['nullable', 'array'],
        ]);

        // Jika input type = "Angka"
        if ($validated['input_type'] === 'Angka') {
            $validated['options'] = null;

            $maleMin = $request->ranges['male']['min'] ?? null;
            $maleMax = $request->ranges['male']['max'] ?? null;
            $femaleMin = $request->ranges['female']['min'] ?? null;
            $femaleMax = $request->ranges['female']['max'] ?? null;
            if (is_null($maleMin) && is_null($maleMax) && is_null($femaleMin) && is_null($femaleMax)) {
                $validated['ranges'] = null;
            } else {
                $validated['ranges'] = [
                    'male' => [
                        'min' => $maleMin,
                        'max' => $maleMax,
                    ],
                    'female' => [
                        'min' => $femaleMin,
                        'max' => $femaleMax,
                    ],
                ];
            }
        }

        // Jika input type = "Teks Bebas"
        if ($validated['input_type'] === 'Teks Bebas') {
            $validated['ranges']  = null;
            $validated['options'] = null;
        }

        // Jika input type = "Pilihan"
        if ($validated['input_type'] === 'Pilihan') {
            $validated['ranges'] = null;

            // bersihkan pilihan agar tidak ada item kosong
            $validated['options'] = array_values(
                array_filter($request->options ?? [], fn($opt) => !empty($opt))
            );
        }

        // ---- Simpan ke database ----
        MCUParameter::create([
            'category_id' => $validated['category_id'],
            'name'        => $validated['name'],
            'input_type'  => $validated['input_type'],
            'ranges'      => $validated['ranges'],   // otomatis jadi JSON
            'options'     => $validated['options'],  // otomatis jadi JSON
        ]);

        return redirect()->route('mcu-parameter.index')
            ->with('success', 'Parameter MCU berhasil ditambahkan.');
    }


    public function update(Request $request, $id)
    {
        $mcuparameter = MCUParameter::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:mcu_categories,name,' . $id,
        ]);

        $mcuparameter->update($validated);

        return redirect()->route('mcu-parameter.index')->with('success', 'Parameter MCU berhasil diubah.');
    }

    public function destroy($id)
    {
        $mcuparameter = MCUParameter::findOrFail($id);
        $mcuparameter->delete();

        return redirect()->route('mcu-parameter.index')->with('success', 'Parameter MCU berhasil dihapus.');
    }
}
