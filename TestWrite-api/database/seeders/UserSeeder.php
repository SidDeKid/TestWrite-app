<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Sid_1',
            'email' => 'sid_1@gmail.com',
            'password' => '$mm$24VsTKOqjkQy',
            'role_id' => 1,
        ]);

        User::create([
            'name' => 'Sid_2',
            'email' => 'sid_2@gmail.com',
            'password' => '$mm$24VsTKOqjkQy',
            'role_id' => 2,
        ]);

        User::create([
            'name' => 'Sid_3',
            'email' => 'sid_3@gmail.com',
            'password' => '$mm$24VsTKOqjkQy',
            'role_id' => 3,
        ]);

        User::create([
            'name' => 'Sid_3_2',
            'email' => 'sid_3_2@gmail.com',
            'password' => '$mm$24VsTKOqjkQy',
            'role_id' => 3,
        ]);
    }
}
