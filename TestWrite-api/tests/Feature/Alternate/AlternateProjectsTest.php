<?php

namespace Tests\Feature\Resources;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AlternateProjectsTest extends TestCase
{
    use RefreshDatabase;

    public function test_not_found_show(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->actingAs($user)->get('/api/projects/'. $project->id + 1);
        $response->assertStatus(404);
    }

    public function test_unauthenticated_show(): void
    {
        $role = Role::factory()->client()->create();
        $user = User::factory()->for($role)->create();
        $project = Project::factory()->for($user)->create();

        $response = $this->get('/api/projects/'. $project->id);
        $response->assertStatus(302);
    }

    public function test_someone_elses_show(): void
    {
        $role = Role::factory()->client()->create();
        $users = User::factory()->for($role)->count(2)->create();
        $project = Project::factory()->for($users[0])->create();

        $response = $this->actingAs($users[1])->get('/api/projects/'. $project->id);
        $response->assertStatus(401);
    }
}
