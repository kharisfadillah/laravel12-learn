<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\Participant;
use App\Models\Province;
use App\Models\Regency;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'username' => 'superadmin',
            'name' => 'Super Mimin',
            'email' => 'super.mimin@example.com',
            'password' => Hash::make('password'),
            'is_sa' => true,
        ]);

        $company = Company::create([
            'code' => 'JG',
            'name' => 'PT. JHONLIN GROUP'
        ]);

        $department = Department::create([
            'company_id' => $company->id,
            'code' => 'HR',
            'name' => 'HUMAN RESOURCE',
        ]);

        Department::create([
            'company_id' => $company->id,
            'code' => 'SE',
            'name' => 'SOFTWARE ENGINEER',
        ]);

        // $province = Province::create([
        //     'code' => 'KALSEL',
        //     'name' => 'KALIMANTAN SELATAN',
        // ]);

        // Regency::create([
        //     'province_id' => $province->id,
        //     'code' => 'TANBU',
        //     'name' => 'TANAH BUMBU',
        // ]);

        Participant::create([
            'company_id' => $company->id,
            'name' => 'MUHAMMAD HUSNI',
            'position' => 'STAF HR',
            'department_id' => $department->id,
            'birth_date' => '1990-07-12',
            'gender' => 'Laki-laki',
            'phone' => '081234567899',
        ]);
    }
}
