<?php

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\MCUCategoryController;
use App\Http\Controllers\MCUController;
use App\Http\Controllers\MCUParameterController;
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

    Route::get('/secure-page', function () {
        // ...
    })->middleware('permission:some-specific-permission');

    // Route::resource('company', CompanyController::class)->only([
    //     'index',
    //     'store',
    //     'update',
    //     'destroy'
    // ]);

    Route::resource('company', CompanyController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ])->middleware([
        'index'   => 'permission:company.index',
        'store'   => 'permission:company.store',
        'update'  => 'permission:company.update',
        'destroy' => 'permission:company.destroy',
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

    Route::resource('mcu', MCUController::class)->only([
        'index',
        'create',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('mcu-category', MCUCategoryController::class)->only([
        'index',
        'store',
        'update',
        'destroy'
    ]);

    Route::resource('mcu-parameter', MCUParameterController::class)->only([
        'index',
        'create',
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

    Route::get('/mcu/{id}/review', [MCUController::class, 'review'])
        ->name('mcu.review');
    Route::post('/mcu/{id}/review', [MCUController::class, 'storeReview'])
        ->name('mcu.store.review');
    Route::get('/mcu/{id}/follow-up', [MCUController::class, 'followUp'])
        ->name('mcu.follow-up');

    Route::get('/participant/search', [ParticipantController::class, 'search'])
        ->name('participant.search');

    Route::get('/mcu-parameter/search', [MCUParameterController::class, 'search'])
        ->name('mcu-parameter.search');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
