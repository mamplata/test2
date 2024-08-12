<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Specify the table name if it's not the plural of the model name
    protected $table = 'tasks';

    // Specify which attributes should be mass assignable
    protected $fillable = [
        'title',
        'description',
        'completed',
    ];

    // Cast attributes to specific types
    protected $casts = [
        'completed' => 'boolean',
    ];
}
