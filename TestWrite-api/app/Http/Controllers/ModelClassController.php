<?php

namespace App\Http\Controllers;

use App\Models\ModelClass;
use Illuminate\Http\Request;

class ModelClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ModelClass::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:model_classes',
            'project_id' => 'integer|required|exists:projects,id',
            'name' => 'required|max:255',
            'has_list' => 'boolean',
            'has_current' => 'boolean'
        ]);
        if($validation)
        {
            ModelClass::create($request->all());
            return response()->json(['message' => 'ModelClass created successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ModelClass $modelClass)
    {
        return $modelClass;
    }

    /**
     * Display the relasionships specified resource.
     */
    public function properties(ModelClass $modelClass)
    {
        return $modelClass->properties()->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ModelClass $modelClass)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:model_classes',
            'project_id' => 'integer|required|exists:projects,id',
            'name' => 'required|max:255',
            'has_list' => 'boolean',
            'has_current' => 'boolean'
        ]);
        if($validation)
        {
            $modelClass->update($request->all());
            return response()->json(['message' => 'ModelClass updated successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModelClass $modelClass)
    {
        return $modelClass->destroy();
    }

    /**
     * Make a unique id.
     */
    public function getUniqueId()
    {
        $lastModelClass = ModelClass::orderBy('id', 'desc')->first();
        if (isset($lastModelClass)) return $lastModelClass->id + 1;
        return 1;
    }
}
