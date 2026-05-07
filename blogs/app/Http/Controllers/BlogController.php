<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('category')
            ->where('is_published', true)
            ->latest('published_at')
            ->paginate(3);

        $featuredBlogs = Blog::where('is_featured', true)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('blogs.index', compact(
            'blogs',
            'featuredBlogs'
        ));
    }

    public function show(Blog $blog)
    {
        abort_if(!$blog->is_published, 404);

        $blog->increment('views');

        $relatedBlogs = Blog::where('id', '!=', $blog->id)
            ->where('blog_category_id', $blog->blog_category_id)
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('blogs.show', compact(
            'blog',
            'relatedBlogs'
        ));
    }
}
