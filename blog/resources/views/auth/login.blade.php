<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">

    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <title>
        Login
    </title>

    <script src="https://cdn.tailwindcss.com"></script>

</head>

<body class="bg-zinc-100 overflow-x-hidden">

<section class="relative min-h-screen overflow-hidden">

    <!-- BACKGROUND -->
    <div class="absolute inset-0 overflow-hidden">

        <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>

        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-300 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>

    </div>

    <div class="relative z-10 min-h-screen flex items-center justify-center px-4 py-10">

        <div class="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-zinc-200">

            <!-- LEFT -->
            <div class="hidden lg:flex relative bg-green-900 text-white p-14 flex-col justify-between overflow-hidden">

                <!-- GLOW -->
                <div class="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

                <div class="relative z-10">

                    <div class="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10">

                        <div class="w-3 h-3 rounded-full bg-green-400"></div>

                        <span class="text-sm font-semibold">
                            Gemrishi CMS
                        </span>

                    </div>

                    <h1 class="mt-10 text-6xl font-black leading-tight tracking-tight">

                        Welcome
                        <span class="block text-green-300">
                            Back.
                        </span>

                    </h1>

                    <p class="mt-8 text-lg leading-relaxed text-white/70 max-w-md">

                        Manage blogs, categories, SEO and content publishing
                        from one modern dashboard experience.

                    </p>

                </div>

                <!-- FOOTER -->
                <div class="relative z-10 flex items-center gap-4">

                    <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">

                        ✨

                    </div>

                    <div>

                        <h3 class="font-bold text-lg">
                            Modern Publishing
                        </h3>

                        <p class="text-white/60 text-sm">
                            Fast, secure and responsive CMS
                        </p>

                    </div>

                </div>

            </div>

            <!-- RIGHT -->
            <div class="p-8 sm:p-12 lg:p-16 flex items-center">

                <div class="w-full">

                    <!-- MOBILE LOGO -->
                    <div class="lg:hidden flex items-center gap-3 mb-10">

                        <div class="w-14 h-14 rounded-2xl bg-green-900 text-white flex items-center justify-center text-xl font-black">

                            G

                        </div>

                        <div>

                            <h2 class="text-xl font-black text-zinc-900">

                                Gemrishi CMS

                            </h2>

                            <p class="text-sm text-zinc-500">

                                Content Management Platform

                            </p>

                        </div>

                    </div>

                    <!-- HEADING -->
                    <div>

                        <h2 class="text-5xl font-black tracking-tight text-zinc-900">

                            Login

                        </h2>

                        <p class="mt-4 text-zinc-500 text-lg">

                            Enter your credentials to continue.

                        </p>

                    </div>

                    <!-- FORM -->
                    <form method="POST"
                          action="{{ route('login') }}"
                          class="mt-12 space-y-7">

                        @csrf

                        <!-- EMAIL -->
                        <div>

                            <label class="block text-sm font-bold text-zinc-700 mb-3">

                                Email Address

                            </label>

                            <input type="email"
                                   name="email"
                                   value="{{ old('email') }}"
                                   placeholder="Enter your email"
                                   required
                                   class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900 transition">

                            @error('email')

                                <p class="mt-2 text-sm text-red-500">

                                    {{ $message }}

                                </p>

                            @enderror

                        </div>

                        <!-- PASSWORD -->
                        <div>

                            <div class="flex items-center justify-between mb-3">

                                <label class="block text-sm font-bold text-zinc-700">

                                    Password

                                </label>

                            </div>

                            <input type="password"
                                   name="password"
                                   placeholder="Enter your password"
                                   required
                                   class="w-full h-16 px-6 rounded-2xl border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-900 transition">
                            @error('password')

                                <p class="mt-2 text-sm text-red-500">

                                    {{ $message }}

                                </p>

                            @enderror
                        </div>

                        <!-- BUTTON -->
                        <button type="submit"
                                class="w-full h-16 rounded-2xl bg-green-900 text-white font-bold text-lg shadow-lg shadow-green-900/20 hover:opacity-90 transition">

                            Login to Dashboard

                        </button>

                    </form>

                </div>

            </div>

        </div>

    </div>

</section>


    <!-- SUCCESS TOAST -->
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

    <!-- ERROR TOAST -->
    @if(session('error'))

        <div id="toastError"
            class="fixed top-24 right-6 z-[9999] flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500 text-white shadow-2xl translate-y-[-20px] opacity-0 transition duration-500">

            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg">

                ✕

            </div>

            <div>

                <h3 class="font-bold">
                    Error
                </h3>

                <p class="text-sm text-white/80">
                    {{ session('error') }}
                </p>

            </div>

        </div>

    @endif

    <script>

        /*
        |--------------------------------------------------------------------------
        | SUCCESS TOAST
        |--------------------------------------------------------------------------
        */

        const toastSuccess =
            document.getElementById('toastSuccess');

        if (toastSuccess)
        {
            setTimeout(() => {

                toastSuccess.classList.remove('opacity-0');
                toastSuccess.classList.remove('-translate-y-5');

            }, 100);

            setTimeout(() => {

                toastSuccess.classList.add('opacity-0');

            }, 3500);

            setTimeout(() => {

                toastSuccess.remove();

            }, 4000);
        }

        /*
        |--------------------------------------------------------------------------
        | ERROR TOAST
        |--------------------------------------------------------------------------
        */

        const toastError =
            document.getElementById('toastError');

        if (toastError)
        {
            setTimeout(() => {

                toastError.classList.remove('opacity-0');
                toastError.classList.remove('-translate-y-5');

            }, 100);

            setTimeout(() => {

                toastError.classList.add('opacity-0');

            }, 3500);

            setTimeout(() => {

                toastError.remove();

            }, 4000);
        }

    </script>

</body>
</html>