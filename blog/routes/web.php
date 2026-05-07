<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;




    Route::prefix('blogs')->group(function () {

        Route::get('/login', [AuthController::class, 'showLogin'])
            ->name('login');

        Route::post('/login', [AuthController::class, 'login']);

        Route::get('/register', [AuthController::class, 'showRegister']);

        Route::post('/register', [AuthController::class, 'register']);

        Route::middleware('auth')->group(function () {

            Route::get('/dashboard', function () {
                return view('dashboard');
            })->name('dashboard');

            Route::post('/logout', [AuthController::class, 'logout']);
        });

    });

    Route::get('/', [BlogController::class, 'index'])
        ->name('blogs.index');

    Route::get('/{blog:slug}', [BlogController::class, 'show'])
        ->name('blogs.show');
