<!DOCTYPE html>
<html lang="en">
<head>

    <!-- BASIC -->
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <!-- TITLE -->
    <title>
        {{ $blog->meta_title ?? $blog->title }} | GemRishi
    </title>

    <!-- SEO -->
    <meta name="description"
          content="{{ $blog->meta_description ?? Str::limit(strip_tags($blog->excerpt), 160) }}">

    <meta name="keywords"
          content="{{ $blog->meta_keywords ?? 'gemstones, astrology, zodiac, birthstones, healing crystals, luxury jewelry' }}">

    <meta name="robots"
          content="{{ $blog->indexable ? 'index, follow' : 'noindex, nofollow' }}">

    <meta name="author"
          content="GemRishi">

    <meta name="language"
          content="English">

    <meta name="revisit-after"
          content="7 days">

    <!-- CANONICAL -->
    <link rel="canonical"
          href="{{ url()->current() }}">

    <!-- OPEN GRAPH -->
    <meta property="og:type"
          content="article">

    <meta property="og:site_name"
          content="GemRishi">

    <meta property="og:title"
          content="{{ $blog->meta_title ?? $blog->title }}">

    <meta property="og:description"
          content="{{ $blog->meta_description ?? Str::limit(strip_tags($blog->excerpt), 160) }}">

    <meta property="og:url"
          content="{{ url()->current() }}">

    <meta property="og:image"
          content="{{ $blog->og_image ?? $blog->featured_image }}">

    <meta property="og:image:alt"
          content="{{ $blog->featured_image_alt }}">

    <meta property="article:published_time"
          content="{{ optional($blog->published_at)->toIso8601String() }}">

    <meta property="article:modified_time"
          content="{{ optional($blog->updated_at)->toIso8601String() }}">

    <!-- TWITTER -->
    <meta name="twitter:card"
          content="summary_large_image">

    <meta name="twitter:title"
          content="{{ $blog->meta_title ?? $blog->title }}">

    <meta name="twitter:description"
          content="{{ $blog->meta_description ?? Str::limit(strip_tags($blog->excerpt), 160) }}">

    <meta name="twitter:image"
          content="{{ $blog->og_image ?? $blog->featured_image }}">

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

<body class="bg-base-100 text-base-content">

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
    
<article class="bg-[#06110c] text-white overflow-x-hidden">

    {{-- HERO --}}
    <section class="relative min-h-[60vh] md:min-h-screen overflow-hidden">

        {{-- BANNER IMAGE --}}
        <div class="absolute inset-0">

            <img
                src="{{ asset('storage/' . $blog->banner_image) }}"
                alt="{{ $blog->featured_image_alt }}"
                class="w-full h-full object-cover opacity-30"
            >

            <div class="absolute inset-0
                        bg-gradient-to-b
                        from-black/70
                        via-black/50
                        to-[#06110c]">
            </div>

        </div>

        {{-- CONTENT --}}
        <div class="relative z-10 pb-10">

            <div class="max-w-7xl mx-auto px-4 md:px-6 pt-24 md:pt-36 pb-16 md:pb-20">

                {{-- TOP --}}
                <div class="max-w-4xl">

                    <div class="flex flex-wrap items-center gap-4 mb-8">

                        <div class="px-5 py-2 rounded-full
                                    bg-emerald-500/20
                                    border border-emerald-500/30
                                    text-emerald-300
                                    text-sm">

                            {{ $blog->category->name }}

                        </div>

                        <div class="text-white/50 text-sm">

                            {{ $blog->published_at?->format('d M Y') }}

                        </div>

                        <div class="text-white/50 text-sm">

                            {{ $blog->reading_time }} min read

                        </div>

                    </div>

                    {{-- TITLE --}}
                    <h1 class="text-5xl md:text-7xl
                               font-black leading-[1.05]
                               tracking-tight">

                        {{ $blog->title }}

                    </h1>

                    {{-- EXCERPT --}}
                    @if($blog->excerpt)

                        <p class="mt-10 text-lg md:text-2xl
                                  text-white/70 leading-relaxed
                                  max-w-3xl">

                            {{ $blog->excerpt }}

                        </p>

                    @endif

                </div>

            </div>

        </div>

    </section>

    {{-- FEATURED IMAGE CARD --}}
    <section class="relative z-20 -mt-24">

        <div class="max-w-6xl mx-auto px-4 md:px-6">

            <div class="overflow-hidden rounded-[2rem]
                        border border-white/10
                        shadow-2xl">

                <img
                    src="{{ asset('storage/' . $blog->featured_image) }}"
                    alt="{{ $blog->featured_image_alt }}"
                    class="w-full max-h-[420px] object-cover"
                >

            </div>

        </div>

    </section>

    {{-- ARTICLE --}}
    <section class="relative">

        <div class="max-w-4xl mx-auto px-4 md:px-6 py-20 md:py-28">

            {{-- META ROW --}}
            <div class="flex flex-wrap items-center gap-6
                        mb-16 pb-8 border-b border-white/10">

                <div>

                    <div class="text-sm text-white/50 mb-1">
                        Published
                    </div>

                    <div class="font-semibold">
                        {{ $blog->published_at?->format('d M Y') }}
                    </div>

                </div>

                <div>

                    <div class="text-sm text-white/50 mb-1">
                        Reading Time
                    </div>

                    <div class="font-semibold">
                        {{ $blog->reading_time }} Minutes
                    </div>

                </div>

                <div>

                    <div class="text-sm text-white/50 mb-1">
                        Views
                    </div>

                    <div class="font-semibold">
                        {{ number_format($blog->views) }}
                    </div>

                </div>

            </div>

            {{-- CONTENT --}}
            <div class="blog-content">

                {!! $blog->content !!}

            </div>

            {{-- TAGS --}}
            @if($blog->tags)

                <div class="mt-20 pt-10 border-t border-white/10">

                    <div class="flex flex-wrap gap-3">

                        @foreach(explode(',', $blog->tags) as $tag)

                            <div class="px-4 py-2 rounded-full
                                        bg-emerald-500/10
                                        border border-emerald-500/20
                                        text-emerald-300 text-sm">

                                #{{ $tag }}

                            </div>

                        @endforeach

                    </div>

                </div>

            @endif

        </div>

    </section>

    {{-- RELATED --}}
    @if($relatedBlogs->count())

        <section class="max-w-7xl mx-auto px-4 md:px-6 pb-28">

            <div class="mb-14">

                <h2 class="text-4xl md:text-6xl
                           font-black tracking-tight">

                    Related Blogs

                </h2>

                <p class="text-white/50 mt-4 text-lg">

                    Continue exploring gemstone wisdom.

                </p>

            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

                @foreach($relatedBlogs as $related)

                    <a href="{{ route('blogs.show', $related->slug) }}"
                       class="group rounded-[2rem]
                              overflow-hidden
                              bg-white/[0.03]
                              border border-white/10
                              hover:border-emerald-500/30
                              transition duration-500">

                        <div class="h-72 overflow-hidden">

                            <img
                                src="{{ asset('storage/' . $related->featured_image) }}"
                                alt="{{ $related->featured_image_alt }}"
                                class="w-full h-full object-cover
                                       group-hover:scale-105
                                       transition duration-700"
                            >

                        </div>

                        <div class="p-7">

                            <div class="flex items-center justify-between mb-5">

                                <div class="text-xs uppercase tracking-widest
                                            text-emerald-300">

                                    {{ $related->category->name }}

                                </div>

                                <div class="text-xs text-white/40">

                                    {{ $related->published_at?->format('d M Y') }}

                                </div>

                            </div>

                            <h3 class="text-2xl font-bold leading-snug">

                                {{ $related->title }}

                            </h3>

                            <p class="mt-5 text-white/60 leading-relaxed">

                                {{ Str::limit($related->excerpt, 110) }}

                            </p>

                        </div>

                    </a>

                @endforeach

            </div>

        </section>

    @endif

</article>

<style>

.blog-content{
    font-size: 1.15rem;
    line-height: 2;
    color: rgba(255,255,255,.78);
}

.blog-content h2{
    font-size: 2.7rem;
    font-weight: 900;
    margin-top: 5rem;
    margin-bottom: 2rem;
    line-height: 1.1;
    color: white;
}

.blog-content h3{
    font-size: 1.8rem;
    font-weight: 800;
    margin-top: 4rem;
    margin-bottom: 1.5rem;
    color: white;
}

.blog-content p{
    margin-bottom: 2rem;
}

.blog-content ul,
.blog-content ol{
    margin: 2rem 0;
    padding-left: 1.5rem;
}

.blog-content ul{
    list-style: disc;
}

.blog-content ol{
    list-style: decimal;
}

.blog-content li{
    margin-bottom: 1rem;
}

.blog-content blockquote{
    margin: 4rem 0;
    padding: 2rem;
    border-left: 4px solid #054b33;
    background: rgba(255,255,255,.03);
    border-radius: 1.5rem;
    font-size: 1.3rem;
    line-height: 1.8;
    font-style: italic;
    color: white;
}

.blog-content a{
    color: #054b33;
    text-decoration: underline;
}

.blog-content strong{
    color: white;
    font-weight: 700;
}

.blog-content code{
    background: rgba(255,255,255,.06);
    padding: .3rem .6rem;
    border-radius: .5rem;
    font-size: .95rem;
}

.blog-content pre{
    background: #020617;
    padding: 2rem;
    border-radius: 1.5rem;
    overflow-x: auto;
    margin: 3rem 0;
    color: white;
}

.blog-content img{
    border-radius: 2rem;
    margin: 4rem 0;
}

</style>

</body>
</html>