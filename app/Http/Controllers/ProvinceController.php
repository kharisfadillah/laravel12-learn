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
        $provinces = Province::select('id', 'province_code', 'province_name')->get();

        return Inertia::render('province/index', [
            'provinces' => $provinces,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('province/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'province_code' => 'required|string|max:10|unique:provinces,province_code',
            'province_name' => 'required|string|max:100',
        ]);

        Province::create($validated);

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil ditambahkan.');
    }
}
