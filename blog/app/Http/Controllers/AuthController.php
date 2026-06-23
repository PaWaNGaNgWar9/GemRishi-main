<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {

            return redirect()->route('dashboard');

        }

        return view('auth.login');
    }

    public function showRegister()
    {
        if (Auth::check()) {

            return redirect()->route('dashboard');

        }

        return view('auth.register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('login')
            ->with('success', 'Account created');
    }

    public function login(Request $request)
    {

        $credentials = $request->validate([

            'email' => 'required|email',

            'password' => 'required|min:6',

        ]);

        $attempts =
            session()->get('login_attempts', 0);

        $lockedUntil =
            session()->get('login_locked_until');

        if (
            $lockedUntil &&
            now()->timestamp < $lockedUntil
        )
        {
            $remaining =
                $lockedUntil - now()->timestamp;

            return back()->with(
                'error',
                "Too many attempts. Try again in {$remaining} seconds."
            );
        }

        if (!Auth::attempt(
            $credentials,
            $request->boolean('remember')
        ))
        {
            $attempts++;

            session()->put(
                'login_attempts',
                $attempts
            );

            if ($attempts >= 3)
            {
                session()->put(
                    'login_locked_until',
                    now()->addMinute()->timestamp
                );

                session()->forget('login_attempts');

                return back()->with(
                    'error',
                    'Too many login attempts. Please wait 60 seconds.'
                );
            }

            return back()->with(
                'error',
                'Invalid email or password.'
            );
        }

        session()->forget([
            'login_attempts',
            'login_locked_until'
        ]);

        $request->session()->regenerate();

        return redirect()
            ->route('dashboard')
            ->with(
                'success',
                'Welcome back!'
            );
    }


    public function updatePassword(Request $request)
    {
        $request->validate([

            'password' => 'required|min:6',

        ]);

        Auth::user()->update([

            'password' => Hash::make($request->password)

        ]);

        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()
            ->route('login')
            ->with(
                'success',
                'Password updated. Please login again.'
            );
    }    

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
