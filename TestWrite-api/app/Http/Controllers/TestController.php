<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Test::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:tests',
            'project_id' => 'integer|required|exists:projects,id',
            'test_header_id' => 'integer|required|exists:test_headers,id',
            'happy_road' => 'required|boolean',
            'name' => 'max:255',
            'test_path' => 'max:500',
            'expected_result' => 'max:500',
            'tested_result' => 'max:500',
            'succes' => 'boolean'
        ]);
        if($validation)
        {
            Test::create($request->all());
            return response()->json(['message' => 'Test created successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        return $test;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Test $test)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:tests',
            'project_id' => 'integer|required|exists:projects,id',
            'test_header_id' => 'integer|required|exists:test_headers,id',
            'happy_road' => 'required|boolean',
            'name' => 'max:255',
            'test_path' => 'max:500',
            'expected_result' => 'max:500',
            'tested_result' => 'max:500',
            'succes' => 'boolean'
        ]);
        if($validation)
        {
            $test->update($request->all());
            return response()->json(['message' => 'Test updated successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        return $test->destroy();
    }

    /**
     * Make a unique id.
     */
    public function getUniqueId()
    {
        $lastTest = Test::orderBy('id', 'desc')->first();
        if (isset($lastTest)) return $lastTest->id + 1;
        return 1;
    }
}
