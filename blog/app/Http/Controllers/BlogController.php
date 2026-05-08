<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

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

        $sessionKey = 'blog_viewed_' . $blog->id;

        if (!session()->has($sessionKey))
        {
            $blog->increment('views');

            session()->put($sessionKey, true);
        }

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

    public function list()
    {
        $blogs = Blog::latest()
            ->paginate(2);

        return view(
            'blogs.list',
            compact('blogs')
        );
    }
    
    public function create()
    {
        $categories = BlogCategory::latest()
            ->get();

        return view(
            'blogs.create',
            compact('categories')
        );
    }

    public function store(Request $request)
    {
        $request->validate([

            // BASIC
            'title' => 'required|max:255',
            'excerpt' => 'nullable',
            'content' => 'required',
            'blog_category_id' => 'required|exists:blog_categories,id',

            // IMAGE
            'featured_image' => 'required|image|mimes:jpg,jpeg,png,webp',

            // SEO
            'meta_title' => 'nullable|max:255',
            'meta_description' => 'nullable',
            'meta_keywords' => 'nullable',

            // AUTHOR
            'author_name' => 'required|max:255',

        ]);

        // dd($request->all());


        $featuredImage = null;

        if ($request->hasFile('featured_image'))
        {
            $featuredImage = time() . '.' .
                $request->featured_image->extension();

            $request->featured_image->move(
                public_path('uploads/blogs'),
                $featuredImage
            );
        }

        Blog::create([

            // BASIC
            'title' => $request->title,

            'slug' => Str::slug($request->title),

            'excerpt' => $request->excerpt,

            'content' => $request->content,

            'blog_category_id' => $request->blog_category_id,

            // SEO
            'meta_title' => $request->meta_title,

            'meta_description' => $request->meta_description,

            'meta_keywords' => $request->meta_keywords,

            // MEDIA
            'featured_image' => $featuredImage,

            // TAGS
            'tags' => $request->tags,

            // AUTHOR
            'author_name' => $request->author_name,

            // STATUS
            'is_published' => true,

            'published_at' => now(),

            // STATS
            'views' => 0,

            'reading_time' => str_word_count($request->content) > 0
                ? ceil(str_word_count(strip_tags($request->content)) / 200)
                : 1,

            // FEATURED
            'is_featured' => false,

            'sort_order' => 0,

        ]);

        return redirect()
            ->route('blogs.list')
            ->with(
                'success',
                'Blog created successfully.'
            );
    }   
    
    public function edit($id)
    {
        $blog = Blog::findOrFail($id);

        $categories = BlogCategory::latest()->get();

        return view(
            'blogs.edit',
            compact(
                'blog',
                'categories'
            )
        );
    }

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);

        $request->validate([

            'title' => 'required|max:255',

            'excerpt' => 'nullable',

            'content' => 'required',

            'blog_category_id' => 'required|exists:blog_categories,id',

            'featured_image' => 'nullable|image|mimes:jpg,jpeg,png,webp',

            'author_name' => 'required|max:255',

        ]);

        $featuredImage = $blog->featured_image;

        if ($request->hasFile('featured_image'))
        {
            // DELETE OLD
            if (
                $blog->featured_image &&
                file_exists(
                    public_path(
                        'uploads/blogs/' . $blog->featured_image
                    )
                )
            )
            {
                unlink(
                    public_path(
                        'uploads/blogs/' . $blog->featured_image
                    )
                );
            }

            $featuredImage = time() . '.' .
                $request->featured_image->extension();

            $request->featured_image->move(
                public_path('uploads/blogs'),
                $featuredImage
            );
        }

        $blog->update([

            'title' => $request->title,

            'slug' => Str::slug($request->title),

            'excerpt' => $request->excerpt,

            'content' => $request->content,

            'blog_category_id' => $request->blog_category_id,

            'meta_title' => $request->meta_title,

            'meta_description' => $request->meta_description,

            'meta_keywords' => $request->meta_keywords,

            'featured_image' => $featuredImage,

            'tags' => $request->tags,

            'author_name' => $request->author_name,

            'reading_time' =>
                ceil(
                    str_word_count(
                        strip_tags($request->content)
                    ) / 200
                ),

        ]);

        return redirect()
            ->route('blogs.list')
            ->with(
                'success',
                'Blog updated successfully.'
            );
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if (
            $blog->featured_image &&
            file_exists(
                public_path(
                    'uploads/blogs/' . $blog->featured_image
                )
            )
        )
        {
            unlink(
                public_path(
                    'uploads/blogs/' . $blog->featured_image
                )
            );
        }

        $blog->delete();

        return redirect()
            ->route('blogs.list')
            ->with(
                'success',
                'Blog deleted successfully.'
            );
    }
}
