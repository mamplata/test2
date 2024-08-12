<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the tasks.
     */
    public function index()
    {
        // Fetch all tasks from the database
        $tasks = Task::all();

        // Return the tasks as a JSON response
        return response()->json($tasks);
    }
}
