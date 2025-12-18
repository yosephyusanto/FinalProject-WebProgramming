<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class RegisterController extends Controller
{
    // Show registration form
    public function showRegistrationForm()
    {
        return Inertia::render('Auth/Register');
    }

    // Handle registration request
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:giver,taker',
            'location' => 'nullable|string|max:255',
        ]);

        // Create the user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'location' => $validated['location'] ?? null,
        ]);

        // Log the user in
        Auth::login($user);

        // Redirect based on role
        if ($user->isGiver()) {
            return redirect()->route('listings.create')
                ->with('success', 'Account created! You can now list materials.');
        } else {
            return redirect()->route('marketplace')
                ->with('success', 'Account created! Start browsing materials.');
        }
    }
}
