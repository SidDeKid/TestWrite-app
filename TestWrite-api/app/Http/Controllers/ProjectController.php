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
            'id' => 'integer|unique:projects',
            'user_id' => 'integer|required|exists:users,id',
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if($validation)
        {
            Project::create($request->all());
            return response()->json(['message' => 'Project created successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return $project;
    }

    /**
     * Display the relasionships specified resource.
     */
    public function modelClasses(Project $project)
    {
        return $project->modelClasses()->get();
    }

    /**
     * Display the relasionships resource.
     */
    public function testHeaders(Project $project)
    {
        return $project->testHeaders()->get();
    }

    /**
     * Display the relasionships resource.
     */
    public function testHeadersWithTests(Project $project)
    {
        return $project->testHeaders()->with('tests')->get();
    }

    /**
     * Display the relasionships resource.
     */
    public function tests(Project $project)
    {
        return $project->tests()->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validation = $request->validate([
            'id' => 'integer|unique',
            'user_id' => 'integer|required|exists:users,id',
            'name' => 'required|max:255',
            'description' => 'max:500'
        ]);
        if($validation)
        {
            $project->update($request->all());
            return response()->json(['message' => 'Project updated successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        return $project->delete();
    }

    /**
     * Make a unique id.
     */
    public function getUniqueId()
    {
        $lastProject = Project::orderBy('id', 'desc')->first();
        if (isset($lastProject)) return $lastProject->id + 1;
        return 1;
    }
}
