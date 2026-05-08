@extends('layouts.app')

@section('title', 'Create Blog')

@section('content')

<section class="py-10 bg-zinc-100 min-h-screen">

    <form method="POST"
            id="blogForm"
          action="{{ route('blogs.store') }}"
          enctype="multipart/form-data">

        @csrf

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- HEADER -->
            <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

                <div>

                    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-900 text-sm font-semibold mb-4">

                        <div class="w-2 h-2 rounded-full bg-green-700"></div>

                        Blog Publishing Studio

                    </div>

                    <h1 class="text-5xl font-black tracking-tight text-zinc-900">

                        Create New Blog

                    </h1>

                    <p class="mt-4 text-zinc-500 max-w-2xl leading-relaxed">

                        Write engaging articles, optimize SEO,
                        upload media and publish high-quality content
                        from one professional workspace.

                    </p>

                </div>

                <!-- ACTION -->
                <div class="flex items-center gap-4">

                    <button type="submit"
                            class="h-14 px-8 rounded-2xl bg-green-900 text-white font-bold shadow-lg shadow-green-900/20 hover:opacity-90 transition">

                        Publish Blog

                    </button>

                </div>

            </div>

            <!-- LAYOUT -->
            <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">

                <!-- LEFT -->
                <div class="xl:col-span-8 space-y-8">

                    <!-- BASIC -->
                    <div class="bg-white rounded-[2rem] border border-zinc-200 shadow-sm p-8">

                        <div class="mb-8">

                            <h2 class="text-2xl font-black text-zinc-900">
                                Basic Information
                            </h2>

                            <p class="mt-2 text-zinc-500">
                                Main blog content and publishing details.
                            </p>

                        </div>

                        <div class="space-y-7">

                            <!-- TITLE -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Blog Title

                                </label>

                                <input type="text"
                                       name="title"
                                       required
                                       placeholder="Enter blog title..."
                                       value="{{ old('title') }}"
                                       class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                                            @error('title')
                                                <p class="mt-2 text-sm text-red-500">
                                                    {{ $message }}
                                                </p>
                                            @enderror
                            </div>

                            <!-- EXCERPT -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Short Excerpt

                                </label>

                                <textarea name="excerpt"
                                          rows="4"
                                          placeholder="Write a short summary..."
                                          value="{{ old('excerpt') }}"
                                          class="w-full px-6 py-5 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900 resize-none">{{ old('excerpt') }}</textarea>

                            </div>

                            <!-- CONTENT -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Blog Content

                                </label>

                                <!-- HIDDEN INPUT -->
                                <input type="hidden"
                                    name="content"
                                    id="content">

                                <!-- EDITOR -->
                                <div id="editor"
                                    class="bg-white rounded-2xl border border-zinc-300 min-h-[500px] overflow-hidden">

                                    {!! old('content') !!}

                                </div>
                                            @error('content')
                                                <p class="mt-2 text-sm text-red-500">
                                                    {{ $message }}
                                                </p>
                                            @enderror

                            </div>

                        </div>

                    </div>

                    <!-- SEO -->
                    <div class="bg-white rounded-[2rem] border border-zinc-200 shadow-sm p-8">

                        <div class="mb-8">

                            <h2 class="text-2xl font-black text-zinc-900">
                                SEO Settings
                            </h2>

                            <p class="mt-2 text-zinc-500">
                                Improve Google search visibility and sharing.
                            </p>

                        </div>

                        <div class="space-y-7">

                            <!-- META TITLE -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Meta Title

                                </label>

                                <input type="text"
                                       name="meta_title"
                                       placeholder="SEO optimized title..."
                                       value="{{ old('meta_title') }}"
                                       class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                            </div>

                            <!-- META DESCRIPTION -->
                            <div>

                                <div class="flex items-center justify-between mb-3">

                                    <label class="block text-sm font-bold text-zinc-700">

                                        Meta Description

                                    </label>

                                    <span id="metaDescriptionCount"
                                        class="text-sm text-zinc-400">

                                        0 / 150

                                    </span>

                                </div>

                                <textarea name="meta_description"
                                        id="metaDescription"
                                        rows="5"
                                        maxlength="150"
                                        placeholder="SEO description..."
                                        class="w-full px-6 py-5 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900 resize-none">{{ old('meta_description') }}</textarea>

                                @error('meta_description')

                                    <p class="mt-2 text-sm text-red-500">

                                        {{ $message }}

                                    </p>

                                @enderror

                            </div>

                            <script>

                                const metaDescription =
                                    document.getElementById('metaDescription');

                                const metaDescriptionCount =
                                    document.getElementById('metaDescriptionCount');

                                function updateMetaDescriptionCount()
                                {
                                    metaDescriptionCount.innerText =
                                        `${metaDescription.value.length} / 150`;
                                }

                                updateMetaDescriptionCount();

                                metaDescription.addEventListener(
                                    'input',
                                    updateMetaDescriptionCount
                                );

                            </script>

                            <!-- KEYWORDS -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Meta Keywords

                                </label>

                                <input type="text"
                                       name="meta_keywords"
                                       placeholder="laravel, php, seo..."
                                       value="{{ old('meta_keywords') }}"
                                       class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                            </div>

                        </div>

                    </div>

                </div>

                <!-- RIGHT -->
                <div class="xl:col-span-4 space-y-8">

                    <!-- PUBLISH -->
                    <div class="bg-white rounded-[2rem] border border-zinc-200 shadow-sm p-8">

                        <div class="mb-8">

                            <h2 class="text-2xl font-black text-zinc-900">
                                Publishing
                            </h2>

                            <p class="mt-2 text-zinc-500">
                                Manage blog category and author.
                            </p>

                        </div>

                        <div class="space-y-6">

                            <!-- CATEGORY -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Category

                                </label>

                                <select name="blog_category_id"
                                        required
                                        class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                                    <option value="">
                                        Select Category
                                    </option>

                                    @foreach($categories as $category)

                                        <option value="{{ $category->id }}">

                                            {{ $category->name }}

                                        </option>

                                    @endforeach

                                </select>
                                            @error('blog_category_id')
                                                <p class="mt-2 text-sm text-red-500">
                                                    Category required.
                                                </p>
                                            @enderror

                            </div>

                            <!-- TAGS -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Tags

                                </label>

                                <input type="text"
                                       name="tags"
                                       placeholder="tech, laravel, seo..."
                                       value="{{ old('tags') }}"
                                       class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                            </div>

                            <!-- AUTHOR -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Author Name

                                </label>

                                <input type="text"
                                       name="author_name"
                                       value="{{ auth()->user()->name }}"
                                       class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                            </div>

                        </div>

                    </div>

                    <!-- MEDIA -->
                    <div class="bg-white rounded-[2rem] border border-zinc-200 shadow-sm p-8">

                        <div class="mb-8">

                            <h2 class="text-2xl font-black text-zinc-900">
                                Media Upload
                            </h2>

                            <p class="mt-2 text-zinc-500">
                                Upload featured blog image.
                            </p>

                        </div>

                        <div class="space-y-6">

                            <!-- FEATURED IMAGE -->
                            <div>

                                <label class="block text-sm font-bold text-zinc-700 mb-3">

                                    Featured Image

                                </label>

                                <input type="file"
                                       name="featured_image"
                                       accept="image/*"
                                       required
                                       class="file-input file-input-bordered w-full rounded-2xl">
                                            @error('featured_image')
                                                <p class="mt-2 text-sm text-red-500">
                                                    {{ $message }}
                                                </p>
                                            @enderror
                            </div>

                            <!-- PREVIEW -->
                            <div class="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">

                                <div class="w-20 h-20 rounded-[2rem] bg-green-100 text-green-900 flex items-center justify-center text-4xl mx-auto">

                                    🖼️

                                </div>

                                <p class="mt-5 text-sm text-zinc-500 leading-relaxed">

                                    Recommended size:
                                    <br>
                                    1200 × 630 pixels

                                </p>

                            </div>

                        </div>

                    </div>

                    <!-- QUICK TIPS -->
                    <div class="bg-green-900 rounded-[2rem] text-white p-8 overflow-hidden relative">

                        <div class="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

                        <div class="relative z-10">

                            <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-6">

                                💡

                            </div>

                            <h2 class="text-2xl font-black">

                                Writing Tips

                            </h2>

                            <ul class="mt-6 space-y-4 text-sm text-white/80 leading-relaxed">

                                <li>
                                    • Keep titles short and engaging.
                                </li>

                                <li>
                                    • Use proper headings in content.
                                </li>

                                <li>
                                    • Add SEO optimized descriptions.
                                </li>

                                <li>
                                    • Use high quality featured images.
                                </li>

                            </ul>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </form>

</section>


<script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

<script>

    /*
    |--------------------------------------------------------------------------
    | INIT QUILL
    |--------------------------------------------------------------------------
    */

    const quill = new Quill('#editor', {

        theme: 'snow',

        placeholder: 'Start writing your blog...',

        modules: {

            toolbar: [

                [{ header: [1, 2, 3, false] }],

                ['bold', 'italic', 'underline', 'strike'],

                ['blockquote', 'code-block'],

                [{ list: 'ordered' }, { list: 'bullet' }],

                [{ indent: '-1' }, { indent: '+1' }],

                [{ color: [] }, { background: [] }],

                ['link', 'image', 'video'],

                ['clean']

            ]

        }

    });

    /*
    |--------------------------------------------------------------------------
    | OLD CONTENT
    |--------------------------------------------------------------------------
    */

    let oldContent = `{!! old('content') !!}`;

    if (oldContent)
    {
        quill.root.innerHTML = oldContent;
    }

    /*
    |--------------------------------------------------------------------------
    | FORM SUBMIT
    |--------------------------------------------------------------------------
    */

    document
        .getElementById('blogForm')
        .addEventListener('submit', function ()
        {
            document.getElementById('content').value =
                quill.root.innerHTML;
        });

</script>

@endsection