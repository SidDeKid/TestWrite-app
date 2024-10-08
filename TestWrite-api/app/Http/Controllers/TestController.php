<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestHeader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response('This resource does not have an index', 404);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (TestHeader::find($request->test_header_id)->first()->project()->first()->user_id != Auth::user()->id) return response('Unauthorized', 401);

        $validation = $request->validate([
            'test_header_id' => 'integer|required|exists:test_headers,id',
            'happy_road' => 'required|boolean',
            'name' => 'max:255',
            'test_path' => 'max:500',
            'expected_result' => 'max:500',
            'tested_result' => 'max:500',
            'succes' => 'boolean'
        ]);
        if(!$validation) return response('Bad Request', 400);

        $test = Test::create($request->all());
        return response()->json([
            'id' => $test->id
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Test $test)
    {
        if ($test->testHeader()->first()->project()->first()->user_id != Auth::user()->id) return response('Unauthorized', 401);

        return $test;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Test $test)
    {
        if ($test->testHeader()->first()->project()->first()->user_id != Auth::user()->id) return response('Unauthorized', 401);

        $validation = $request->validate([
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
        if ($test->testHeader()->first()->project()->first()->user_id != Auth::user()->id) return response('Unauthorized', 401);

        return $test->destroy();
    }
}
