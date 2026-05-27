<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;




    Route::middleware('guest')->group(function () {

        Route::get('/login', [AuthController::class, 'showLogin'])
            ->name('login');

        Route::post('/login', [AuthController::class, 'login'])
            ->name('login.submit');

        // Route::get('/register', [AuthController::class, 'showRegister'])
        //     ->name('register');

        // Route::post('/register', [AuthController::class, 'register'])
        //     ->name('register.submit');
    });

    Route::middleware('auth')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');
            
        Route::get('/myblogs', [BlogController::class, 'list'])
            ->name('blogs.list');

        Route::get('/myblogs/create', [BlogController::class, 'create'])
            ->name('blogs.create');

        Route::post('/myblogs', [BlogController::class, 'store'])
            ->name('blogs.store');

        Route::post('/blogs/upload-image', [BlogController::class, 'uploadEditorImage'])
            ->name('blogs.upload.image');
            
        Route::get('/myblogs/{id}/edit', [BlogController::class, 'edit'])
            ->name('blogs.edit');

        Route::delete('/myblogs/{id}', [BlogController::class, 'destroy'])
            ->name('blogs.destroy');

        Route::put('/myblogs/{id}', [BlogController::class, 'update'])
            ->name('blogs.update');

        Route::get('/categories', [CategoryController::class, 'index'])
            ->name('categories.index');

        Route::post('/categories', [CategoryController::class, 'store'])
            ->name('categories.store');

        Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])
            ->name('categories.destroy');

        Route::post('/update-password', [AuthController::class, 'updatePassword'])
            ->name('password.update');

        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('logout');
    });


    Route::get('/', [BlogController::class, 'index'])
        ->name('blogs.index');

    Route::get('/{blog:slug}', [BlogController::class, 'show'])
        ->name('blogs.show');
