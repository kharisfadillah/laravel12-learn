<?php

use App\Http\Controllers\ProvinceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Route::get('province', function () {
    //     return Inertia::render('province');
    // })->name('province');

    Route::get('/province', [ProvinceController::class, 'index'])->name('province.index');
    Route::post('/province', [ProvinceController::class, 'store'])->name('province.store');
    Route::put('/province/{id}', [ProvinceController::class, 'update'])->name('province.update');
    Route::delete('/province/{id}', [ProvinceController::class, 'destroy'])->name('province.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
