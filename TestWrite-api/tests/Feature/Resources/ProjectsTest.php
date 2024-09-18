<?php

namespace Tests\Feature\Resources;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectsTest extends TestCase
{
    use RefreshDatabase;

    public function test_index(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();

        $response = $this->actingAs($user)->get('/api/projects');
        $response->assertStatus(200);
    }

    public function test_show(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->get('/api/projects/'. $project->id);
        $response->assertStatus(200);
    }

    public function test_create(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();

        $response = $this->actingAs($user)->post('/api/projects', [
            'name' => 'TestProject',
            'description' => 'No description'
        ]);
        $response->assertStatus(201);
    }

    public function test_update(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->put('/api/projects/'. $project->id, [
            'name' => 'TestProject',
            'description' => 'No description'
        ]);
        $response->assertStatus(200);
    }

    public function test_delete(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->delete('/api/projects/'. $project->id);
        $response->assertStatus(200);
    }

    public function test_tests(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->get('/api/projects/'. $project->id .'/tests');
        $response->assertStatus(200);
    }

    public function test_model_classes(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->get('/api/projects/'. $project->id . '/model-classes');
        $response->assertStatus(200);
    }
}
