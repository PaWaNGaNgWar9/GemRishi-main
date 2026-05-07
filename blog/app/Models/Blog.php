<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [

        // Basic
        'title',
        'slug',
        'excerpt',
        'content',
        'blog_category_id',

        // SEO
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'schema_type',
        'indexable',

        // Media
        'featured_image',
        'featured_image_alt',
        'banner_image',

        // Tags
        'tags',

        // Author
        'author_name',

        // Status
        'is_published',
        'published_at',

        // Stats
        'views',
        'reading_time',

        // Featured
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'tags' => 'array',
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'indexable' => 'boolean',
        'published_at' => 'datetime',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'blog_category_id');
    }

    /*
    |--------------------------------------------------------------------------
    | Boot
    |--------------------------------------------------------------------------
    */

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {

            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }

            if (empty($blog->meta_title)) {
                $blog->meta_title = $blog->title;
            }

            if (empty($blog->meta_description) && $blog->excerpt) {
                $blog->meta_description = Str::limit(strip_tags($blog->excerpt), 160);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Accessors
    |--------------------------------------------------------------------------
    */

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function getFeaturedImageUrlAttribute()
    {
        return $this->featured_image
            ? asset($this->featured_image)
            : asset('images/default-blog.jpg');
    }
}