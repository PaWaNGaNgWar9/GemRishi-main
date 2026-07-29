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
                    bg-[#D5F5E3] backdrop-blur-xl
                    border-b border-white/10">

            <div class="flex-1">

                <a href="{{ route('blogs.index') }}"
                   class="text-xl md:text-2xl font-bold tracking-wide">
                    <img src="{{ asset('media/GemRishi.svg') }}"
                         alt="GemRishi Logo"
                         class="w-40 h-12 mr-2 inline-block">
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

        <section class="max-w-7xl mx-auto px-4 md:px-6 pt-20 pb-12 md:py-20">

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
                    pt-20 pb-12 md:py-20">

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

</main>

</body>
</html>