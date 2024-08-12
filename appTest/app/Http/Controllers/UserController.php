<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Display the specified user by ID.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function show($id)
    {
        // Fetch the user from the database
        $user = DB::table('users')->find($id);

        if (!$user) {
            // Return a 404 response if the user is not found
            return response()->json(['message' => 'User not found'], 404);
        }

        // Return user data as JSON
        return response()->json([
            'message' => 'User found',
            'user' => $user
        ]);
    }
}
