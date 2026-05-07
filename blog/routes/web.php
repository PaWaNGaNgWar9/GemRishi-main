<?php

use App\Http\Controllers\BlogController;
use Illuminate\Support\Facades\Route;


    Route::get('/', [BlogController::class, 'index'])
        ->name('blogs.index');

    Route::get('/{blog:slug}', [BlogController::class, 'show'])
        ->name('blogs.show');


Route::middleware('auth')->group(function () {

    Route::resource('/admin/blogs', BlogController::class);

    Route::resource('/admin/categories', CategoryController::class);
});        