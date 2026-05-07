<!DOCTYPE html>
<html lang="en">
<head>

    <!-- BASIC SEO -->
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>
        GemRishi Blogs | Astrology, Gemstones & Spiritual Guidance
    </title>

    <meta name="description"
          content="Explore GemRishi blogs about astrology gemstones, birthstones, healing crystals, zodiac guidance, luxury jewelry, and spiritual wellness.">

    <meta name="keywords"
          content="gemstones, astrology, birthstones, ruby stone, blue sapphire, emerald, healing crystals, zodiac gemstones, luxury jewelry">

    <meta name="robots"
          content="index, follow">

    <meta name="author"
          content="GemRishi">

    <!-- CANONICAL -->
    <link rel="canonical"
          href="{{ url()->current() }}">

    <!-- OPEN GRAPH -->
    <meta property="og:type"
          content="website">

    <meta property="og:title"
          content="GemRishi Blogs | Astrology & Gemstone Knowledge">

    <meta property="og:description"
          content="Discover premium gemstone guides, astrology insights, zodiac recommendations, and luxury jewelry content.">

    <meta property="og:url"
          content="{{ url()->current() }}">

    <meta property="og:site_name"
          content="GemRishi">

    <meta property="og:image"
          content="{{ asset('media/GemRishi.svg') }}">

    <!-- FAVICON -->
    <link rel="icon"
          type="image/png"
          href="{{ asset('media/logo.jpg') }}">

    <!-- DAISY UI -->
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5"
          rel="stylesheet"
          type="text/css" />

    <!-- TAILWIND -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

</head>
<body class="bg-base-100 text-base-content overflow-x-hidden">

    {{-- NAVBAR --}}
    <header class="fixed top-0 left-0 w-full z-50">

        <div class="navbar px-4 md:px-8 lg:px-14
                    bg-base-100/70 backdrop-blur-xl
                    border-b border-white/10">

            <div class="flex-1">

                <a href="{{ route('blogs.index') }}"
                   class="text-xl md:text-2xl font-bold tracking-wide">
                    <img src="{{ asset('media/GemRishi.svg') }}"
                         alt="GemRishi Logo"
                         class="w-34 h-8 mr-2 inline-block">
                </a>

            </div>

            <div class="flex items-center gap-5 md:gap-8">

                <a href="{{ route('blogs.index') }}"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Home

                </a>

                <a href="https://gemrishi.com"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Open gemrishi.com

                </a>

            </div>

        </div>

    </header>

{{-- MAIN --}}
<main>

    {{-- HERO --}}
    @if($blogs->count() || $featuredBlogs->count())

        <section class="relative min-h-[60vh] md:min-h-[75vh]
                        flex items-center justify-center
                        overflow-hidden">

            {{-- BG IMAGE --}}
            <div class="absolute inset-0">

                <img
                    src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1800&auto=format&fit=crop"
                    alt="Gemstones"
                    class="w-full h-full object-cover"
                >

                <div class="absolute inset-0 bg-black/70"></div>

            </div>

            {{-- CONTENT --}}
            <div class="relative z-10 text-center px-4 max-w-5xl">

                <div class="inline-flex items-center
                            px-5 py-2 rounded-full
                            bg-emerald-500/10
                            border border-emerald-500/20
                            text-emerald-300
                            text-sm mb-6">

                    Since 1904 • Luxury Gemstones

                </div>

                <h1 class="text-4xl sm:text-5xl md:text-7xl
                           font-black leading-tight text-white">

                    GemRishi Blogs

                </h1>

                <p class="mt-6 text-base sm:text-lg md:text-xl
                          text-white/70 leading-relaxed
                          max-w-3xl mx-auto">

                    Discover astrology insights, gemstone wisdom,
                    luxury jewelry stories, spiritual healing,
                    and birthstone guidance.

                </p>

            </div>

        </section>

    @endif

    {{-- FEATURED --}}
    @if($featuredBlogs->count())

        <section class="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">

            <div class="mb-8 md:mb-12">

                <h2 class="text-3xl md:text-5xl
                           font-black tracking-tight">

                    Featured Blogs

                </h2>

                <p class="text-black/60 mt-3 text-lg">

                    Handpicked stories from GemRishi.

                </p>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                @foreach($featuredBlogs as $blog)

                    <a href="{{ route('blogs.show', $blog->slug) }}"
                       class="group rounded-[2rem]
                              overflow-hidden
                              bg-white
                              border border-black/5
                              hover:-translate-y-2
                              hover:shadow-2xl
                              transition duration-500">

                        <div class="h-72 overflow-hidden">

                            <img
                                src="{{ asset('uploads/blogs/' . $blog->featured_image) }}"
                                alt="{{ $blog->featured_image_alt }}"
                                class="w-full h-full object-cover
                                       group-hover:scale-105
                                       transition duration-700"
                            >

                        </div>

                        <div class="p-7">

                            <div class="flex items-center justify-between mb-5">

                                <div class="px-4 py-1.5 rounded-full
                                            bg-emerald-50
                                            text-emerald-700
                                            text-sm font-medium">

                                    {{ $blog->category->name }}

                                </div>

                                <span class="text-sm text-black/40">

                                    {{ $blog->published_at?->format('d M Y') }}

                                </span>

                            </div>

                            <h3 class="text-2xl font-black leading-snug">

                                {{ $blog->title }}

                            </h3>

                            <p class="mt-4 text-black/60 leading-relaxed">

                                {{ Str::limit($blog->excerpt, 120) }}

                            </p>

                        </div>

                    </a>

                @endforeach

            </div>

        </section>

    @endif

    {{-- BLOGS --}}
    <section class="max-w-7xl mx-auto
                    px-4 md:px-6
                    py-12 md:py-20">

        <div class="mb-8 md:mb-10">

            <h2 class="text-3xl md:text-5xl
                       font-black tracking-tight">

                Latest Blogs

            </h2>

            <p class="text-black/60 mt-3 text-lg">

                Gemstones, astrology, healing and luxury.

            </p>

        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

            @forelse($blogs as $blog)

                <a href="{{ route('blogs.show', $blog->slug) }}"
                   class="group rounded-[2rem]
                          overflow-hidden
                          bg-[#08120d]
                          border border-white/10
                          hover:border-emerald-500/20
                          hover:-translate-y-2
                          transition duration-500">

                    <div class="h-64 overflow-hidden">

                        <img
                            src="{{ asset('uploads/blogs/' . $blog->featured_image) }}"
                            alt="{{ $blog->featured_image_alt }}"
                            class="w-full h-full object-cover
                                   group-hover:scale-105
                                   transition duration-700"
                        >

                    </div>

                    <div class="p-7">

                        <div class="flex items-center justify-between mb-5">

                            <div class="px-4 py-1.5 rounded-full
                                        bg-emerald-500/10
                                        border border-emerald-500/20
                                        text-emerald-300
                                        text-sm">

                                {{ $blog->category->name }}

                            </div>

                            <span class="text-sm text-white/40">

                                {{ $blog->published_at?->format('d M Y') }}

                            </span>

                        </div>

                        <h3 class="text-2xl font-black
                                   leading-snug text-white">

                            {{ $blog->title }}

                        </h3>

                        <p class="mt-4 text-white/60
                                  leading-relaxed">

                            {{ Str::limit($blog->excerpt, 120) }}

                        </p>

                        <div class="mt-6 flex items-center justify-between">

                            <div class="text-sm text-white/40">

                                {{ $blog->reading_time }} min read

                            </div>

                            <div class="inline-flex items-center gap-2
                                        text-emerald-300
                                        text-sm font-medium">

                                Read More

                                <svg xmlns="http://www.w3.org/2000/svg"
                                     class="w-4 h-4"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">

                                    <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M9 5l7 7-7 7" />

                                </svg>

                            </div>

                        </div>

                    </div>

                </a>

            @empty

                <div class="col-span-full">

                    <div class="rounded-[2rem]
                                border border-black/5
                                bg-white
                                py-16 md:py-20
                                px-6 md:px-10
                                text-center">

                        {{-- ICON --}}
                        <div class="w-16 h-16 mx-auto
                                    rounded-2xl
                                    bg-emerald-50
                                    flex items-center justify-center">

                            <svg xmlns="http://www.w3.org/2000/svg"
                                 class="w-8 h-8 text-emerald-700"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor">

                                <path stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.7"
                                      d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />

                            </svg>

                        </div>

                        {{-- TITLE --}}
                        <h3 class="mt-8 text-3xl md:text-5xl
                                   font-black text-black">

                            No Blogs Published Yet

                        </h3>

                        {{-- TEXT --}}
                        <p class="mt-5 max-w-2xl mx-auto
                                  text-black/60
                                  leading-relaxed text-lg">

                            GemRishi articles about astrology,
                            gemstones, birthstones, healing,
                            and luxury jewelry will appear here soon.

                        </p>

                        {{-- LINK --}}
                        <div class="mt-10">

                            <a href="https://gemrishi.com"
                               target="_blank"
                               class="inline-flex items-center gap-2
                                      text-emerald-700
                                      hover:text-emerald-900
                                      font-semibold transition">

                                Visit Main Website

                                <svg xmlns="http://www.w3.org/2000/svg"
                                     class="w-4 h-4"
                                     fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">

                                    <path stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M14 5l7 7m0 0l-7 7m7-7H3" />

                                </svg>

                            </a>

                        </div>

                    </div>

                </div>

            @endforelse

        </div>

        @if($blogs->count())

            <div class="mt-16 flex justify-center">

                {{ $blogs->links() }}

            </div>

        @endif

    </section>

</main>

</body>
</html>