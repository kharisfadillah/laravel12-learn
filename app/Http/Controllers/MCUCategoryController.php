<?php

namespace App\Http\Controllers;

use App\Models\MCUCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MCUCategoryController extends Controller
{
    public function index(Request $request): Response
    {

        $search = $request->input('search');

        $mcucategories = MCUCategory::query()
            ->select('id', 'name')
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MCUCategory/Index', [
            'mcucategories' => $mcucategories,
            'filters' => [
                'search' => $search,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:mcu_categories,name',
        ]);

        MCUCategory::create($validated);

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $mcucategory = MCUCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:mcu_categories,name,' . $id,
        ]);

        $mcucategory->update($validated);

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil diubah.');
    }

    public function destroy($id)
    {
        $mcucategory = MCUCategory::findOrFail($id);
        $mcucategory->delete();

        return redirect()->route('mcu-category.index')->with('success', 'Kategori MCU berhasil dihapus.');
    }
}
