<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Property::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:properties',
            'model_class_id' => 'integer|required|exists:model_classes,id',
            'name' => 'required|max:255',
            'type' => 'required|max:255',
            'nullable' => 'required|boolean'
        ]);
        if($validation)
        {
            $property = Property::create($request->all());
            return response()->json([
                'id' => $property->id
            ], 201);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        return $property;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:properties',
            'model_class_id' => 'integer|required|exists:model_classes,id',
            'name' => 'required|max:255',
            'type' => 'required|max:255',
            'nullable' => 'required|boolean'
        ]);
        if($validation)
        {
            $property->update($request->all());
            return response()->json(['message' => 'Property updated successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        return $property->destroy();
    }
}
