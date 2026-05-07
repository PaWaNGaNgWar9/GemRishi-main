<?php

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;


    Route::get('/', [BlogController::class, 'index'])
        ->name('blogs.index');

    Route::get('/{blog:slug}', [BlogController::class, 'show'])
        ->name('blogs.show');