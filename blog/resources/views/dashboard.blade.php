@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')

<section class="py-10 sm:py-14">

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- HERO CARD -->
        <div class="relative overflow-hidden rounded-[2rem] bg-white border border-zinc-200 shadow-sm">

            <!-- BACKGROUND -->
            <div class="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50"></div>

            <div class="relative z-10 p-8 sm:p-12 lg:p-16">

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <!-- LEFT -->
                    <div>

                        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 mb-6">

                            <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>

                            <span class="text-sm text-zinc-600">
                                Welcome back, {{ auth()->user()->name }}
                            </span>

                        </div>

                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-zinc-900">

                            Manage Your
                            <span class="block">
                                Blog Platform
                            </span>

                        </h1>

                        <p class="mt-6 text-lg text-zinc-500 leading-relaxed max-w-xl">

                            Create blogs, manage categories,
                            organize subcategories, and control
                            your entire content system from one dashboard.

                        </p>

                        <!-- ACTIONS -->
                        <div class="flex flex-wrap gap-4 mt-10">

                            <a href="/blogs/create"
                               class="px-6 py-3.5 rounded-2xl bg-black text-white font-semibold hover:opacity-90 transition">

                                Create Blog

                            </a>

                            <a href="/categories/create"
                               class="px-6 py-3.5 rounded-2xl border border-zinc-300 hover:bg-zinc-100 transition font-medium">

                                Add Category

                            </a>

                        </div>

                    </div>

                    <!-- RIGHT -->
                    <div>

                        <div class="grid grid-cols-2 gap-5">

                            <!-- CARD -->
                            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">

                                <div class="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-6">
                                    📝
                                </div>

                                <p class="text-zinc-500 text-sm">
                                    Total Blogs
                                </p>

                                <h2 class="text-4xl font-black mt-2 text-zinc-900">
                                    24
                                </h2>

                            </div>

                            <!-- CARD -->
                            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">

                                <div class="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-6">
                                    📂
                                </div>

                                <p class="text-zinc-500 text-sm">
                                    Categories
                                </p>

                                <h2 class="text-4xl font-black mt-2 text-zinc-900">
                                    12
                                </h2>

                            </div>

                            <!-- CARD -->
                            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">

                                <div class="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-6">
                                    🗂️
                                </div>

                                <p class="text-zinc-500 text-sm">
                                    Subcategories
                                </p>

                                <h2 class="text-4xl font-black mt-2 text-zinc-900">
                                    48
                                </h2>

                            </div>

                            <!-- CARD -->
                            <div class="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">

                                <div class="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center text-2xl mb-6">
                                    👁️
                                </div>

                                <p class="text-zinc-500 text-sm">
                                    Total Views
                                </p>

                                <h2 class="text-4xl font-black mt-2 text-zinc-900">
                                    14K
                                </h2>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

@endsection