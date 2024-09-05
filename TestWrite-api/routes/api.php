<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ModelClassController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestHeaderController;
use App\Http\Middleware\Client;
use App\Http\Middleware\Admin;
use Illuminate\Support\Facades\Route;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

});

Route::middleware(['auth:sanctum', Client::class])->group(function () {
    Route::apiResource('model-classes', ModelClassController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('properties', PropertyController::class);
    Route::apiResource('tests', TestController::class);
    Route::apiResource('test-headers', TestHeaderController::class);
});

Route::middleware(['auth:sanctum', Admin::class])->group(function () {

});
