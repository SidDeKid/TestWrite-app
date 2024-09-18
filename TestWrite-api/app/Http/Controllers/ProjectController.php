<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Auth::user()->projects()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if(!$validation) return response('Bad Request', 400);

        $project = Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::user()->id
        ]);

        return response()->json(['id' => $project->id], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if ($project->user_id != Auth::user()->id) return response('Unauthorized', 401);
        return $project;
    }

    /**
     * Display the relasionships specified resource.
     */
    public function modelClasses(Project $project)
    {
        if ($project->user_id != Auth::user()->id) return response('Unauthorized', 401);
        return $project->modelClasses()->get();
    }


    /**
     * Display the relasionships resource.
     */
    public function tests(Project $project)
    {
        if ($project->user_id != Auth::user()->id) return response('Unauthorized', 401);
        return $project->testHeaders()->with('tests')->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if ($project->user_id != Auth::user()->id) return response('Unauthorized', 401);

        $validation = $request->validate([
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if(!$validation) return response('Bad Request', 400);

        $project->update($request->only(['name', 'description']));

        return response()->json(['message' => 'Project updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->user_id != Auth::user()->id) return response('Unauthorized', 401);
        return $project->delete();
    }
}
