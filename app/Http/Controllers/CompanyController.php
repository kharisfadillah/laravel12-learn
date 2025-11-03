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
}
