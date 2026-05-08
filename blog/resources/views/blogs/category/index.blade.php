@extends('layouts.app')

@section('title', 'Categories')

@section('content')

<section class="py-10 bg-zinc-100 min-h-screen">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- HEADER -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

            <div>

                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-900 text-sm font-semibold mb-4">

                    <div class="w-2 h-2 rounded-full bg-green-700"></div>

                    Blog Categories

                </div>

                <h1 class="text-4xl font-black tracking-tight text-zinc-900">

                    Categories

                </h1>

                <p class="mt-3 text-zinc-500 max-w-2xl">

                    Organize your blog content with clean category management.

                </p>

            </div>

            <!-- BUTTON -->
            <button onclick="openModal()"
                    class="h-13 px-7 rounded-2xl bg-green-900 text-white font-bold shadow-lg shadow-green-900/10 hover:opacity-90 transition">

                + Add Category

            </button>

        </div>

        <!-- SUCCESS -->
        @if(session('success'))

            <div class="mb-8 p-4 rounded-2xl bg-green-100 border border-green-200 text-green-900 font-medium">

                {{ session('success') }}

            </div>

        @endif

        <!-- GRID -->
        @if($categories->count())

            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-5">

                @foreach($categories as $category)

                    <div class="group bg-white rounded-[2rem] border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300">

                        <!-- IMAGE -->
                        <div class="relative h-44 overflow-hidden bg-zinc-100">

                            @if($category->image)

                                <img src="{{ asset('uploads/categories/' . $category->image) }}"
                                     class="w-full h-full object-cover group-hover:scale-105 transition duration-500">

                            @else

                                <div class="w-full h-full flex items-center justify-center text-5xl bg-green-50 text-green-900">

                                    📂

                                </div>

                            @endif

                        </div>

                        <!-- CONTENT -->
                        <div class="p-5">

                            <div class="flex items-start justify-between gap-3">

                                <div class="min-w-0">

                                    <h2 class="text-xl font-black text-zinc-900 truncate">

                                        {{ $category->name }}

                                    </h2>

                                    <p class="mt-1 text-sm text-zinc-400 truncate">

                                        /{{ $category->slug }}

                                    </p>

                                </div>

                                <div class="w-11 h-11 rounded-2xl bg-green-100 text-green-900 flex items-center justify-center shrink-0">

                                    📁

                                </div>

                            </div>

                            <!-- DESCRIPTION -->
                            <p class="mt-4 text-sm text-zinc-600 leading-relaxed line-clamp-2 min-h-[40px]">

                                {{ $category->description ?: 'No description added.' }}

                            </p>

                            <!-- FOOTER -->
                            <div class="flex items-center justify-between mt-6 pt-5 border-t border-zinc-100">

                                <div>

                                    <p class="text-xs uppercase tracking-widest text-zinc-400 font-bold">

                                        Created

                                    </p>

                                    <p class="mt-1 text-sm font-semibold text-zinc-700">

                                        {{ optional($category->created_at)->format('d M Y') }}

                                    </p>

                                </div>

                                <!-- ACTIONS -->
                                <div class="flex items-center gap-2">

                                    <form method="POST"
                                        action="{{ route('categories.destroy', $category->id) }}"
                                        onsubmit="return confirm('Delete this category?')">

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

        @else

            <!-- EMPTY -->
            <div class="rounded-[2rem] bg-white border border-dashed border-zinc-300 p-16 text-center">

                <div class="w-20 h-20 rounded-[2rem] bg-green-100 text-green-900 flex items-center justify-center text-4xl mx-auto">

                    📂

                </div>

                <h2 class="mt-6 text-3xl font-black text-zinc-900">

                    No Categories Found

                </h2>

                <p class="mt-3 text-zinc-500 max-w-md mx-auto">

                    Create your first category to organize blogs properly.

                </p>

                <button onclick="openModal()"
                        class="mt-8 h-13 px-7 rounded-2xl bg-green-900 text-white font-bold hover:opacity-90 transition">

                    Create Category

                </button>

            </div>

        @endif

    </div>

</section>

<!-- MODAL -->
<div id="categoryModal"
     class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm p-4">

    <div class="w-full max-w-2xl rounded-[2rem] bg-white p-8 shadow-2xl overflow-y-auto max-h-[95vh]">

        <div class="flex items-center justify-between mb-8">

            <div>

                <h2 class="text-3xl font-black text-zinc-900">
                    Create Category
                </h2>

                <p class="text-zinc-500 mt-2">
                    Add new blog category.
                </p>

            </div>

            <button onclick="closeModal()"
                    class="w-11 h-11 rounded-2xl hover:bg-zinc-100 transition">

                ✕

            </button>

        </div>

        <form method="POST"
              action="{{ route('categories.store') }}"
              enctype="multipart/form-data"
              class="space-y-6">

            @csrf

            <!-- NAME -->
            <div>

                <label class="block text-sm font-bold text-zinc-700 mb-3">
                    Category Name
                </label>

                <input type="text"
                       name="name"
                       placeholder="Enter category name"
                       required
                       class="w-full h-14 px-5 rounded-2xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black">

                @error('name')

                    <p class="mt-2 text-sm text-red-500">
                        {{ $message }}
                    </p>

                @enderror

            </div>

            <!-- IMAGE -->
            <div>

                <label class="block text-sm font-bold text-zinc-700 mb-3">
                    Category Image
                </label>

                <input type="file"
                       name="image"
                       accept="image/*"
                       class="file-input file-input-bordered w-full rounded-2xl">

                @error('image')

                    <p class="mt-2 text-sm text-red-500">
                        {{ $message }}
                    </p>

                @enderror

            </div>

            <!-- DESCRIPTION -->
            <div>

                <label class="block text-sm font-bold text-zinc-700 mb-3">
                    Description
                </label>

                <textarea name="description"
                          rows="5"
                          placeholder="Enter category description"
                          class="w-full px-5 py-4 rounded-2xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-black resize-none"></textarea>

                @error('description')

                    <p class="mt-2 text-sm text-red-500">
                        {{ $message }}
                    </p>

                @enderror

            </div>

            <!-- BUTTON -->
            <button type="submit"
                    class="w-full h-14 rounded-2xl bg-black text-white font-bold hover:opacity-90 transition">

                Create Category

            </button>

        </form>

    </div>

</div>

<script>

    const modal = document.getElementById('categoryModal');

    function openModal()
    {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeModal()
    {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

</script>



@endsection



