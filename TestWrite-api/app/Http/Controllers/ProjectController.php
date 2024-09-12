<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Project::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'user_id' => 'integer|required|exists:users,id',
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if($validation)
        {
            $project = Project::create($request->all());
            return response()->json([
                'id' => $project->id
            ], 201);
        }
        return response('Bad Request', 400);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if (!$this->isAutherised($project)) return response('Unautherised', 403);
        return $project;
    }

    /**
     * Display the relasionships specified resource.
     */
    public function modelClasses(Project $project)
    {
        if (!$this->isAutherised($project)) return response('Unautherised', 403);
        return $project->modelClasses()->get();
    }


    /**
     * Display the relasionships resource.
     */
    public function tests(Project $project)
    {
        if (!$this->isAutherised($project)) return response('Unautherised', 403);
        return $project->testHeaders()->with('tests')->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if (!$this->isAutherised($project)) return response('Unautherised', 403);

        $validation = $request->validate([
            'id' => 'integer|unique',
            'user_id' => 'integer|required|exists:users,id',
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if(!$validation) return response('Bad Request', 400);

        $project->update($request->all());
        return response()->json(['message' => 'Project updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if (!$this->isAutherised($project)) return response('Unautherised', 403);
        return $project->delete();
    }
}
