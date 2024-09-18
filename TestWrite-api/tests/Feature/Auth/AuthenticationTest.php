<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate(): void
    {
        $role = Role::factory()->create();
        $user = User::factory()->for($role)->create();

        $response = $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertStatus(200);
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $role = Role::factory()->create();
        $user = User::factory()->for($role)->create();

        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void {
        $role = Role::factory()->create();
        $user = User::factory()->for($role)->create();

        $this->post('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->actingAs($user)->post('/api/logout', [])->assertStatus(200);
    }
}
