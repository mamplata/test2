<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:4',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        // Validate request input
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Find the user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        //rCeBb4sVi4ByCWGkxMIDRM1WI6xUlOuFGCoE28G7d233a576

        // Create a new token
        $token = $user->createToken('Personal Access Token', [], now()->addMinutes(10))->plainTextToken;

        // Set a cookie to store the token
        $cookie = cookie('auth_token', $token, 12, null, null, false, true); // HttpOnly = true

        // Return the user and token information with the cookie
        return response()->json([
            'user' => $user,
            'token' => $token
        ])->cookie($cookie);
    }


    /**
     * Log out the user.
     */
    public function logout(Request $request)
    {
        // Revoke the token that was used to authenticate the current request
        $request->user()->currentAccessToken()->delete();

        // Create a cookie that expires in the past to clear it
        $cookie = cookie('auth_token', '', -1); // Set an expiration date in the past

        return response()->json([
            'message' => 'Successfully logged out',
            'success' => true // Indicate success
        ])->withCookie($cookie);
    }
}
