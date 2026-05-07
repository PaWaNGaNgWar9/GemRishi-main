@extends('layouts.app')

@section('title', 'All Blogs')

@section('content')

<section class="py-10 bg-zinc-100 min-h-screen">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- HEADER -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

            <div>

                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-900 text-sm font-semibold mb-4">

                    <div class="w-2 h-2 rounded-full bg-green-700"></div>

                    Blog Management

                </div>

                <h1 class="text-4xl font-black tracking-tight text-zinc-900">

                    Blogs

                </h1>

                <p class="mt-3 text-zinc-500 max-w-2xl">

                    Manage and organize all your published blogs.

                </p>

            </div>

            <a href="{{ route('blogs.create') }}"
               class="h-13 inline-flex items-center justify-center px-7 rounded-2xl bg-green-900 text-white font-bold shadow-lg shadow-green-900/10 hover:opacity-90 transition">

                + Create Blog

            </a>

        </div>

        <!-- BLOG GRID -->
        @if($blogs->count())

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                @foreach($blogs as $blog)

                    <div class="group bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">

                        <!-- IMAGE -->
                        <div class="relative h-56 overflow-hidden bg-zinc-100">

                            @if($blog->featured_image)

                                <img src="{{ asset('uploads/blogs/' . $blog->featured_image) }}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition duration-500">

                            @else

                                <div class="w-full h-full flex items-center justify-center text-6xl bg-green-50 text-green-900">

                                    📝

                                </div>

                            @endif

                            <!-- FEATURED -->
                            @if($blog->is_featured)

                                <div class="absolute top-4 left-4 px-4 py-2 rounded-full bg-green-900 text-white text-xs font-bold">

                                    Featured

                                </div>

                            @endif

                        </div>

                        <!-- CONTENT -->
                        <div class="p-6">

                            <div class="flex items-center gap-2 text-sm text-zinc-500 mb-4">

                                <span>

                                    {{ optional($blog->category)->name }}

                                </span>

                                <span>•</span>

                                <span>

                                    {{ $blog->reading_time ?? 5 }} min read

                                </span>

                            </div>

                            <h2 class="text-2xl font-black text-zinc-900 leading-tight line-clamp-2">

                                {{ $blog->title }}

                            </h2>

                            <p class="mt-4 text-zinc-600 leading-relaxed line-clamp-3">

                                {{ $blog->excerpt }}

                            </p>

                            <!-- FOOTER -->
                            <div class="flex items-center justify-between mt-8 pt-5 border-t border-zinc-100">

                                <div>

                                    <p class="text-xs uppercase tracking-widest text-zinc-400 font-bold">

                                        Published

                                    </p>

                                    <p class="mt-1 text-sm font-semibold text-zinc-700">

                                        {{ optional($blog->published_at)->format('d M Y') }}

                                    </p>

                                </div>

                                <div class="flex items-center gap-2">
                                    
                                    <a href="{{ route('blogs.edit', $blog->id) }}"
                                    class="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-green-100 hover:text-green-900 transition flex items-center justify-center">

                                        ✏️

                                    </a>

                                    <form method="POST"
                                          action="#">

                                        @csrf
                                        @method('DELETE')

                                        <button type="submit"
                                                class="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition flex items-center justify-center">

                                            🗑️

                                        </button>

                                    </form>

                                </div>

                            </div>

                        </div>

                    </div>

                @endforeach

            </div>

            <!-- PAGINATION -->
            <div class="mt-12">

                {{ $blogs->links() }}

            </div>

        @else

            <!-- EMPTY -->
            <div class="rounded-[2rem] bg-white border border-dashed border-zinc-300 p-16 text-center">

                <div class="w-20 h-20 rounded-[2rem] bg-green-100 text-green-900 flex items-center justify-center text-4xl mx-auto">

                    📝

                </div>

                <h2 class="mt-6 text-3xl font-black text-zinc-900">

                    No Blogs Found

                </h2>

                <p class="mt-3 text-zinc-500 max-w-md mx-auto">

                    Start publishing blogs to grow your content platform.

                </p>

                <a href="{{ route('blogs.create') }}"
                   class="mt-8 inline-flex items-center justify-center h-13 px-7 rounded-2xl bg-green-900 text-white font-bold hover:opacity-90 transition">

                    Create First Blog

                </a>

            </div>

        @endif

    </div>

</section>

@endsection