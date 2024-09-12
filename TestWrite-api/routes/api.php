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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
});

Route::middleware(['auth:sanctum', Client::class])->group(function () {
    Route::apiResource('model-classes', ModelClassController::class)->only("index", "show", "store", "update");
    Route::get('model-classes/{model_class}/properties', [ModelClassController::class, 'properties'])->name('model-classes.propperties');

    Route::apiResource('projects', ProjectController::class)->only("index", "show", "store", "update");
    Route::get('projects/{project}/tests', [ProjectController::class, 'tests'])->name('projects.tests');
    Route::get('projects/{project}/model-classes', [ProjectController::class, 'model-classes'])->name('projects.model-classes');

    Route::apiResource('properties', PropertyController::class)->only("show", "store", "update");

    Route::apiResource('tests', TestController::class)->only("show", "store", "update");

    Route::apiResource('test-headers', TestHeaderController::class)->only("show", "store", "update");
    Route::get('test-headers/{test_header}/tests', [TestHeaderController::class, 'tests'])->name('test-headers.tests');;
});

Route::middleware(['auth:sanctum', Admin::class])->group(function () {
    Route::apiResource('projects', ProjectController::class);

    Route::apiResource('model-classes', ModelClassController::class);

    Route::apiResource('properties', PropertyController::class);

    Route::apiResource('tests', TestController::class);

    Route::apiResource('test-headers', TestHeaderController::class);
});
