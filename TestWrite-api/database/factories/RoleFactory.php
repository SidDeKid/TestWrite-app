<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => 2,
            'name' => 'guest'
        ];
    }

    /**
     * Get client access.
     */
    public function client(): static
    {
        return $this->state(fn (array $attributes) => [
            'id' => 3,
            'name' => 'client'
        ]);
    }
}
