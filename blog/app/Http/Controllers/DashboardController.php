<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;

class DashboardController extends Controller
{
    public function index()
    {

        $totalBlogs = Blog::count();

        $totalCategories = BlogCategory::count();

        $totalViews = Blog::sum('views');

        $featuredBlogs = Blog::where('is_featured',true)->count();

        return view(
            'dashboard',
            compact(
                'totalBlogs',
                'totalCategories',
                'totalViews',
                'featuredBlogs'
            )
        );
    }
}