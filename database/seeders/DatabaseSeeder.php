<?php

namespace Database\Seeders;

use App\Models\Province;
use App\Models\Regency;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $province = Province::create([
            'province_code' => 'KALSEL',
            'province_name' => 'KALIMANTAN SELATAN',
        ]);

        Regency::create([
            'province_id' => $province->id,
            'regency_code' => 'TANBU',
            'regency_name' => 'TANAH BUMBU',
        ]);
    }
}
