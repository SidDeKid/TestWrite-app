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

    Route::apiResource('model-classes', ModelClassController::class);
    Route::get('model-classes/{model_class}/properties', [ModelClassController::class, 'properties'])->name('model-classes.propperties');

    Route::apiResource('projects', ProjectController::class);
    Route::get('projects/{project}/tests', [ProjectController::class, 'tests'])->name('projects.tests');
    Route::get('projects/{project}/model-classes', [ProjectController::class, 'modelClasses'])->name('projects.model-classes');

    Route::apiResource('properties', PropertyController::class);

    Route::apiResource('tests', TestController::class);

    Route::apiResource('test-headers', TestHeaderController::class);
    Route::get('test-headers/{test_header}/tests', [TestHeaderController::class, 'tests'])->name('test-headers.tests');
});

Route::middleware(['auth:sanctum', Admin::class])->group(function () {

});
