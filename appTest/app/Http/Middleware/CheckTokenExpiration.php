<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CheckTokenExpiration
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Retrieve the token from the cookie
        $token = $request->cookie('auth_token');

        if (!$token) {
            // No token found in the cookie
            return response()->json(['message' => 'No token provided'], 401);
        }

        // Extract the actual token part after '|'
        $tokenParts = explode('|', $token, 2);
        $actualToken = isset($tokenParts[1]) ? $tokenParts[1] : '';

        // Hash the token for comparison
        $hashedToken = hash('sha256', $actualToken);

        // Retrieve the token record from the database
        $tokenRecord = DB::table('personal_access_tokens')
            ->where('token', $hashedToken)
            ->first();

        if (!$tokenRecord) {
            // Token not found in the database
            return response()->json(['message' => 'Invalid token'], 401);
        }

        if ($tokenRecord->expires_at && Carbon::now()->gt($tokenRecord->expires_at)) {
            // Token is expired
            DB::table('personal_access_tokens')->where('id', $tokenRecord->id)->delete();
            return response()->json(['message' => 'Token expired'], 401);
        }

        // Token is valid; add it to the request attributes
        $request->attributes->set('auth_token', $actualToken);
        $request->attributes->set('userId', $tokenRecord->tokenable_id);

        // Proceed to the next middleware or request handler
        return $next($request);
    }
}
