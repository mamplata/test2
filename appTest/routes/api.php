<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/tasks', [TaskController::class, 'index']);

Route::get('check-token', function (Request $request) {
    // Retrieve the token and userId from the request attributes
    $token = $request->attributes->get('auth_token');
    $userId = $request->attributes->get('userId');

    return response()->json([
        'message' => 'Token is valid',
        'token' => $token,
        'userId' => $userId
    ]);
})->middleware(['token.expiration']);

Route::get('user/{id}', [UserController::class, 'show'])->middleware('auth:sanctum');
