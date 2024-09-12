<?php

namespace App\Http\Controllers;

use App\Models\TestHeader;
use Illuminate\Http\Request;

class TestHeaderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TestHeader::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validation = $request->validate([
            'id' => 'integer|unique:test_headers',
            'name' => 'required|max:255',
        ]);
        if($validation)
        {
            $testHeader = TestHeader::create($request->all());
            return response()->json([
                'id' => $testHeader->id
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
    public function show(TestHeader $testHeader)
    {
        return $testHeader;
    }

    /**
     * Display the relasionships resource.
     */
    public function tests(TestHeader $testHeader)
    {
        return $testHeader->tests()->get();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TestHeader $testHeader)
    {
        $validation = $request->validate([
            'id' => 'integer|unique',
            'name' => 'required|max:255',
        ]);
        if($validation)
        {
            $testHeader->update($request->all());
            return response()->json(['message' => 'Test header updated successfully']);
        }
        else
        {
            return response('Bad Request', 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TestHeader $testHeader)
    {
        return $testHeader->delete();
    }
}
