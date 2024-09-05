<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\ProjectSeeder;
use Database\Seeders\TestSeeder;
use Database\Seeders\ModelClassSeeder;
use Database\Seeders\TestHeaderSeeder;
use Database\Seeders\PropertySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ProjectSeeder::class,
            TestHeaderSeeder::class,
            TestSeeder::class,
            ModelClassSeeder::class,
            PropertySeeder::class,
        ]);
    }
}
