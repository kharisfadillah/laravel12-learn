<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RegencyController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('company', CompanyController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('department', DepartmentController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('role', RoleController::class)->only([
        'index',
        'create',
        'store',
        'edit',
        'update',
        'destroy',
    ]);

    Route::resource('permission', PermissionController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('user', UserController::class)->only([
        'index',
        'create',
        'store',
        'edit',
        'update',
        'destroy'
    ]);

    Route::resource('province', ProvinceController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('regency', RegencyController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('participant', ParticipantController::class)->only([
        'index',
        'create',
        'store',
        'update',
        'destroy'
    ]);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
