<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Property::create([
            'model_class_id' => 1,
            'name' => 'SeedProperty',
            'type' => 'string',
            'nullable' => true
        ]);
    }
}
