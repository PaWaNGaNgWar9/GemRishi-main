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
                    bg-[#D5F5E3] backdrop-blur-xl
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

                <a href="https://gemrishi.com/"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Home

                </a>
                <a href="{{ route('blogs.index') }}"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Blogs

                </a>

                <a href="https://gemrishi.com/suggest"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Suggestion

                </a>

                <a href="https://gemrishi.com/aboutUs"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    About

                </a>

                
                <a href="https://gemrishi.com/contactUs"
                class="text-sm md:text-base font-medium
                        text-black/70 hover:text-emerald-900
                        transition duration-300">

                    Contact

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
                        src="{{ asset('uploads/blogs/' . $blog->featured_image) }}"
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

<footer class="bg-[#264A3F] text-white mt-10">

    <div class="max-w-7xl mx-auto px-6 py-14">

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10">

            <!-- Our Company -->
            <div>
                <h3 class="text-2xl font-bold mb-5">Our Company</h3>

                <ul class="space-y-3 text-md text-white/90">
                    <li><a href="https://gemrishi.com/privacy" class="hover:text-white">About Us</a></li>
                    <li><a href="https://gemrishi.com/career" class="hover:text-white">Careers</a></li>
                    <li><a href="https://gemrishi.com/testimonals" class="hover:text-white">Testimonials</a></li>
                </ul>
            </div>

            <!-- About Gemstone -->
            <div>
                <h3 class="text-2xl font-bold mb-5">About Gemstone</h3>

                <ul class="space-y-3 text-md text-white/90">
                    <li><a href="https://gemrishi.com/privacy" class="hover:text-white">Privacy Policy</a></li>
                    <li><a href="https://gemrishi.com/shipping" class="hover:text-white">Shipping & Returns</a></li>
                    <li><a href="https://gemrishi.com/custom-duties" class="hover:text-white">Custom Duties</a></li>
                    <li><a href="https://gemrishi.com/refund-policy" class="hover:text-white">Refund Policy</a></li>
                </ul>
            </div>

            <!-- Customer Support -->
            <div>
                <h3 class="text-2xl font-bold mb-5">Customer Support</h3>

                <ul class="space-y-3 text-md text-white/90">
                    <li><a href="https://gemrishi.com/gemstone-buy-guide" class="hover:text-white">Gemstone Guide</a></li>
                    <li><a href="https://gemrishi.com/ring-size" class="hover:text-white">Ring Size Guide</a></li>
                    <li><a href="https://gemrishi.com/carat-to-ratti-converter" class="hover:text-white">Carat to Ratti Converter</a></li>
                </ul>
            </div>

            <!-- Ambala -->
            <div>
                <h3 class="text-2xl font-bold mb-5">Ambala Showroom</h3>

                <div class="space-y-3 text-md text-white/90">
                    <p>Nicholson Road, Ambala Haryana 133001</p>

                    <a href="tel:+919817975978" class="block hover:text-white">
                        +91 98179 75978
                    </a>

                    <a href="mailto:wecare@gemrishi.com" class="block hover:text-white break-all">
                        wecare@gemrishi.com
                    </a>
                </div>
            </div>

            <!-- Shimla -->
            <div>
                <h3 class="text-2xl font-bold mb-5">Shimla Showroom</h3>

                <div class="space-y-3 text-md text-white/90">
                    <p>Mall Road, Shimla</p>

                    <a href="tel:+919817975972" class="block hover:text-white">
                        +91 98179 75972
                    </a>

                    <a href="mailto:wecare@gemrishi.com" class="block hover:text-white break-all">
                        wecare@gemrishi.com
                    </a>
                </div>
            </div>

            <!-- Solan -->
            <div>
                <h3 class="text-2xl font-bold mb-5">Solan Showroom</h3>

                <div class="space-y-3 text-md text-white/90">
                    <p>Ward 7, G Square Mall, Solan, Himachal Pradesh 173212</p>

                    <a href="tel:+917496997220" class="block hover:text-white">
                        +91 74969 97220
                    </a>

                    <a href="mailto:wecare@gemrishi.com" class="block hover:text-white break-all">
                        wecare@gemrishi.com
                    </a>
                </div>
            </div>

        </div>

        <!-- Subscribe -->
        <div class="border-t border-white/20 mt-12 pt-10 flex flex-col lg:flex-row justify-between items-center gap-10">


            <!-- Social -->
            <div class="flex items-center gap-6">

                <a href="#" class="hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg>
                </a>

                <a href="#" class="hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                    </svg>
                </a>

                <a href="#" class="hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                    </svg>
                </a>

                <a href="#" class="hover:opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
                    </svg>
                </a>

            </div>

        </div>

        <!-- Popular Searches -->
        <div class="border-t border-white/20 mt-10 pt-10">

            <h3 class="text-3xl font-bold mb-6">
                Popular Searches
            </h3>

            <div class="space-y-8">

                <div>

                    <h4 class="text-xl font-semibold mb-3 text-white/90">
                        Precious Gemstones
                    </h4>

                    <div class="flex flex-wrap gap-x-2 gap-y-2 text-white/80">

                        <a href="#" class="hover:text-white">Ruby</a><span>|</span>
                        <a href="#" class="hover:text-white">Emerald</a><span>|</span>
                        <a href="#" class="hover:text-white">Yellow Sapphire</a><span>|</span>
                        <a href="#" class="hover:text-white">Blue Sapphire</a><span>|</span>
                        <a href="#" class="hover:text-white">Diamond</a>

                    </div>

                </div>

                <div>

                    <h4 class="text-xl font-semibold mb-3 text-white/90">
                        Semi-Precious Gemstones
                    </h4>

                    <div class="flex flex-wrap gap-x-2 gap-y-2 text-white/80">

                        <a href="#" class="hover:text-white">Amethyst</a><span>|</span>
                        <a href="#" class="hover:text-white">Citrine</a><span>|</span>
                        <a href="#" class="hover:text-white">Garnet</a><span>|</span>
                        <a href="#" class="hover:text-white">Moonstone</a><span>|</span>
                        <a href="#" class="hover:text-white">Turquoise</a>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- Bottom Footer -->
    <div class="border-t border-white/20">

        <div class="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row justify-between items-center gap-5">

            <p class="text-white/80 text-sm text-center lg:text-left">
                © {{ date('Y') }}
                <span class="font-semibold text-white">GemRishi</span>.
                Venture by Fateh Chand Bansi Lal Jewellers Private Limited.
                All rights reserved.
            </p>

            <div class="flex items-center gap-6 text-sm">

                <a href="https://gemrishi.com/terms" class="hover:text-white">
                    Terms & Services
                </a>

                <a href="https://gemrishi.com/privacy" class="hover:text-white">
                    Privacy Policy
                </a>

            </div>

        </div>

    </div>

</footer>    

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