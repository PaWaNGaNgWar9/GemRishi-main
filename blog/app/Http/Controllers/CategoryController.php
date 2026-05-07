<?php

namespace App\Http\Controllers;

use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = BlogCategory::latest()->get();

        return view('blogs.category.index', compact('categories'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:blog_categories,name',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
            'description' => 'nullable|string',
        ]);

        $imageName = null;

        if ($request->hasFile('image')) {

            $imageName = time() . '.' .
                $request->image->extension();

            $request->image->move(
                public_path('uploads/categories'),
                $imageName
            );
        }

        BlogCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'image' => $imageName,
            'description' => $request->description,
        ]);

        return back()->with(
            'success',
            'Category created successfully.'
        );
    }

    public function destroy($id)
    {
        $category = BlogCategory::findOrFail($id);

        // DELETE IMAGE
        if ($category->image &&
            file_exists(public_path('uploads/categories/' . $category->image)))
        {
            unlink(public_path('uploads/categories/' . $category->image));
        }

        $category->delete();

        return back()->with(
            'success',
            'Category deleted successfully.'
        );
    }
}
