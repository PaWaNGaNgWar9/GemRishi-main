<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        @yield('title', 'Dashboard')
    </title>

    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
      rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />

    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

</head>

<body class="bg-zinc-100 text-zinc-900 min-h-screen antialiased flex flex-col">

    <!-- NAVBAR -->
    <header class="sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm">

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="h-18 flex items-center justify-between">

                <!-- LOGO -->
                <a href="{{ route('dashboard') }}"
                   class="flex items-center gap-3">

                    <div class="w-11 h-11 rounded-2xl bg-green-900 text-white flex items-center justify-center font-bold text-lg">
                        G
                    </div>

                    <div>
                        <h1 class="text-lg font-bold tracking-tight">
                            Gemrishi
                        </h1>

                        <p class="text-xs text-zinc-500 -mt-1">
                            Blog CMS
                        </p>
                    </div>

                </a>

                <!-- DESKTOP NAV -->
                <nav class="hidden lg:flex items-center gap-2">

                    <a href="{{ route('dashboard') }}"
                       class="px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition">
                        Dashboard
                    </a>

                    <a href="{{ route('blogs.list') }}"
                       class="px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition">
                        Blogs
                    </a>

                    <a href="{{ route('categories.index') }}"
                       class="px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-100 transition">
                        Categories
                    </a>

                </nav>

                <!-- RIGHT -->
                <div class="hidden lg:flex items-center gap-4">

                    <!-- USER -->
                    <div class="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-2 bg-zinc-50">

                        <div class="w-10 h-10 rounded-xl bg-green-900 text-white flex items-center justify-center font-semibold">

                            {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}

                        </div>

                        <div>

                            <h4 class="text-sm font-semibold">
                                {{ auth()->user()->name }}
                            </h4>

                            <p class="text-xs text-zinc-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                    <!-- LOGOUT -->
                    <form method="POST" action="{{ route('logout') }}">

                        @csrf

                        <button type="submit"
                                class="px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:opacity-90 transition">

                            Logout

                        </button>

                    </form>

                </div>

                <!-- MOBILE BUTTON -->
                <button id="menuBtn"
                        class="lg:hidden w-11 h-11 rounded-xl border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition">

                    ☰

                </button>

            </div>

            <!-- MOBILE MENU -->
            <div id="mobileMenu"
                 class="hidden lg:hidden pb-5 pt-4 border-t border-zinc-200 space-y-2">

                <a href="/dashboard"
                   class="block px-4 py-3 rounded-2xl hover:bg-zinc-100 transition">
                    Dashboard
                </a>

                <a href="{{ route('blogs.list') }}"
                   class="block px-4 py-3 rounded-2xl hover:bg-zinc-100 transition">
                    Blogs
                </a>

                <a href="{{ route('categories.index') }}"
                   class="block px-4 py-3 rounded-2xl hover:bg-zinc-100 transition">
                    Categories
                </a>

                <form method="POST"
                      action="{{ route('logout') }}"
                      class="pt-2">

                    @csrf

                    <button type="submit"
                            class="w-full px-4 py-3 rounded-2xl bg-red-500 text-white transition">

                        Logout

                    </button>

                </form>

            </div>

        </div>

    </header>

    <!-- CONTENT -->
    <main class="flex-1">

        @yield('content')

    </main>

    <!-- FOOTER -->
    <footer class="bg-white border-t border-zinc-200 mt-20">

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <div class="flex flex-col lg:flex-row items-center justify-between gap-6">

                <div>

                    <h3 class="text-lg font-bold">
                        Gemrishi CMS
                    </h3>

                    <p class="text-sm text-zinc-500 mt-2">
                        Gemrishi Blog Management System
                    </p>

                </div>

                <div class="flex items-center gap-5 text-sm text-zinc-500">

                    <a href="#"
                       class="hover:text-black transition">
                        Documentation
                    </a>

                    <a href="#"
                       class="hover:text-black transition">
                        Support
                    </a>

                    <a href="#"
                       class="hover:text-black transition">
                        Settings
                    </a>

                </div>

            </div>

            <div class="mt-8 pt-6 border-t border-zinc-200 text-sm text-zinc-500 text-center">

                © {{ date('Y') }} Gemrishi. All rights reserved.

            </div>

        </div>

    </footer>


    <!-- TOAST -->
@if(session('success'))

    <div id="toastSuccess"
         class="fixed top-6 right-6 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl bg-green-900 text-white shadow-2xl translate-y-[-20px] opacity-0 transition duration-500">

        <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">

            ✓

        </div>

        <div>

            <h3 class="font-bold">
                Success
            </h3>

            <p class="text-sm text-white/80">
                {{ session('success') }}
            </p>

        </div>

    </div>

@endif



<script>

    const toast = document.getElementById('toastSuccess');

    if (toast)
    {
        setTimeout(() => {

            toast.classList.remove('opacity-0');
            toast.classList.remove('-translate-y-5');

        }, 100);

        setTimeout(() => {

            toast.classList.add('opacity-0');

        }, 3500);

        setTimeout(() => {

            toast.remove();

        }, 4000);
    }

</script>

    <!-- MOBILE SCRIPT -->
    <script>

        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');

        menuBtn.addEventListener('click', () => {

            mobileMenu.classList.toggle('hidden');

        });

    </script>



</body>
</html>