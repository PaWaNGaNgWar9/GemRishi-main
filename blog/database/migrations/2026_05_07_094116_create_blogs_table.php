<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blogs', function (Blueprint $table) {

            $table->id();

            // BASIC
            $table->string('title');
            $table->string('slug')->unique();

            $table->text('excerpt')->nullable();

            $table->longText('content');

            $table->foreignId('blog_category_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('meta_title')->nullable();

            $table->string('meta_description', 160)->nullable();

            $table->text('meta_keywords')->nullable();

            $table->string('canonical_url')->nullable();

            $table->string('og_title')->nullable();

            $table->text('og_description')->nullable();

            $table->string('og_image')->nullable();

            $table->string('schema_type')
                ->default('Article');

            $table->boolean('indexable')
                ->default(true);

            $table->string('featured_image')->nullable();

            $table->string('featured_image_alt')->nullable();

            $table->string('banner_image')->nullable();

            $table->json('tags')->nullable();

            $table->string('author_name')
                ->default('GemRishi');

            $table->enum('status', ['draft', 'published'])
                ->default('draft');

            $table->boolean('is_published')
                ->default(false);

            $table->timestamp('published_at')
                ->nullable();

            $table->unsignedBigInteger('views')
                ->default(0);

            $table->unsignedInteger('reading_time')
                ->nullable();

            $table->boolean('is_featured')
                ->default(false);

            $table->integer('sort_order')
                ->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blogs');
    }
};
