<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Test;

class TestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Test::create([
            'test_header_id' => 1,
            'happy_road' => true,
            'name' => 'Testnaam',
            'test_path' => 'This test_path was added during seeding. It is not an actual test_path.',
            'expected_result' => 'This expected_result was added during seeding. It is not an actual expected_result.',
            'tested_result' => 'This tested_result was added during seeding. It is not an actual tested_result.',
            'succes' => true
        ]);
    }
}
