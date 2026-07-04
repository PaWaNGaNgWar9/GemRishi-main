<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>
        @yield('title', 'Dashboard')
    </title>

    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css"rel="stylesheet">
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

                    <!-- DASHBOARD -->
                    <a href="{{ route('dashboard') }}"
                    class="px-5 py-2.5 rounded-xl text-sm font-medium transition
                    {{ request()->routeIs('dashboard')
                            ? 'bg-green-900 text-white shadow-lg shadow-green-900/10'
                            : 'text-zinc-700 hover:bg-zinc-100' }}">

                        Dashboard

                    </a>

                    <!-- BLOGS -->
                    <a href="{{ route('blogs.list') }}"
                    class="px-5 py-2.5 rounded-xl text-sm font-medium transition
                    {{ request()->routeIs('blogs.*')
                            ? 'bg-green-900 text-white shadow-lg shadow-green-900/10'
                            : 'text-zinc-700 hover:bg-zinc-100' }}">

                        Blogs

                    </a>

                    <!-- CATEGORIES -->
                    <a href="{{ route('categories.index') }}"
                    class="px-5 py-2.5 rounded-xl text-sm font-medium transition
                    {{ request()->routeIs('categories.*')
                            ? 'bg-green-900 text-white shadow-lg shadow-green-900/10'
                            : 'text-zinc-700 hover:bg-zinc-100' }}">

                        Categories

                    </a>

                </nav>

                <!-- RIGHT -->
                <div class="hidden lg:flex items-center gap-4">

                    <!-- USER -->
                    <button onclick="openPasswordModal()"
                            class="flex items-center gap-3 border border-zinc-200 rounded-2xl px-4 py-2 bg-zinc-50 hover:bg-zinc-100 transition">

                        <div class="w-10 h-10 rounded-xl bg-green-900 text-white flex items-center justify-center font-semibold">

                            {{ strtoupper(substr(auth()->user()->name, 0, 1)) }}

                        </div>

                        <div class="text-left">

                            <h4 class="text-sm font-semibold">
                                {{ auth()->user()->name }}
                            </h4>

                            <p class="text-xs text-zinc-500">
                                Administrator
                            </p>

                        </div>

                    </button>

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

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div class="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

                <p class="text-sm text-zinc-500 text-center sm:text-left">

                    © {{ date('Y') }}
                    <span class="font-semibold text-zinc-800">
                        Gemrishi
                    </span>.
                    All rights reserved.

                </p>

                <div class="flex items-center gap-2 text-sm text-zinc-400">

                    <span class="w-2 h-2 rounded-full bg-green-600"></span>

                    CMS v1.0

                </div>

            </div>

        </div>

    </footer>

    <!-- PASSWORD MODAL -->
    <div id="passwordModal"
        class="fixed inset-0 z-50 hidden items-center justify-center bg-black/50 backdrop-blur-sm p-4">

        <div class="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">

            <!-- HEADER -->
            <div class="p-8 border-b border-zinc-200">

                <div class="flex items-center justify-between">

                    <div>

                        <h2 class="text-3xl font-black text-zinc-900">

                            Change Password

                        </h2>

                        <p class="mt-2 text-zinc-500">

                            Update your account password securely.

                        </p>

                    </div>

                    <button onclick="closePasswordModal()"
                            class="w-11 h-11 rounded-2xl hover:bg-zinc-100 transition">

                        ✕

                    </button>

                </div>

            </div>

            <!-- FORM -->
            <form method="POST"
                action="{{ route('password.update') }}"
                class="p-8 space-y-6">

                @csrf

                <!-- NEW PASSWORD -->
                <div>

                    <label class="block text-sm font-bold text-zinc-700 mb-3">

                        New Password

                    </label>

                    <input type="password"
                        name="password"
                        required
                        placeholder="Enter new password"
                        class="w-full h-14 px-5 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900">

                </div>

                <!-- BUTTON -->
                <button type="submit"
                        class="w-full h-14 rounded-2xl bg-green-900 text-white font-bold hover:opacity-90 transition">

                    Update Password

                </button>

            </form>

        </div>

    </div>    

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

        const passwordModal =
            document.getElementById('passwordModal');

        function openPasswordModal()
        {
            passwordModal.classList.remove('hidden');
            passwordModal.classList.add('flex');
        }

        function closePasswordModal()
        {
            passwordModal.classList.add('hidden');
            passwordModal.classList.remove('flex');
        }

    </script>

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