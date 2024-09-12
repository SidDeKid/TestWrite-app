<?php

namespace App\Http\Controllers;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    protected function isAutherised(Project $project)
    {
        $user = Auth::user();
        return $user->id == $project->user_id || $user->role_id == 1;
    }
}
