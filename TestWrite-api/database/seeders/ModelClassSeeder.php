<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ModelClass;

class ModelClassSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ModelClass::create([
            'project_id' => 1,
            'name' => 'SeedClass',
            'has_list' => true,
            'has_current' => false
        ]);
    }
}
