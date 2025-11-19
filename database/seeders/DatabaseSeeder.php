<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\MCUCategory;
use App\Models\MCUParameter;
use App\Models\Participant;
use App\Models\Provider;
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
            'name' => 'HUMAN RESOURCE',
        ]);

        Department::create([
            'company_id' => $company->id,
            'name' => 'SOFTWARE ENGINEER',
        ]);

        Participant::create([
            'company_id' => $company->id,
            'name' => 'MUHAMMAD HUSNI',
            'position' => 'STAF HR',
            'department_id' => $department->id,
            'birth_date' => '1990-07-12',
            'gender' => 'male',
            'phone' => '081234567899',
        ]);

        $company = Company::create([
            'code' => 'DSP',
            'name' => 'PT. DUA SAMUDERA PERKASA'
        ]);

        Department::create([
            'company_id' => $company->id,
            'name' => 'LOGISTIK',
        ]);

        $department = Department::create([
            'company_id' => $company->id,
            'name' => 'GENERAL AFFAIR',
        ]);

        Participant::create([
            'company_id' => $company->id,
            'name' => 'SITI RAHMAH',
            'position' => 'STAF GA',
            'department_id' => $department->id,
            'birth_date' => '1994-02-23',
            'gender' => 'female',
            'phone' => '082121675563',
        ]);

        $categories = [
            'Pemeriksaan Fisik',
            'Hematologi',
            'Fungsi Metabolik',
            'Profil Lemak',
            'Fungsi Hati',
            'Fungsi Ginjal',
            'Urinalisis',
            'Radiologi',
        ];

        $parameters = [
            [
                'category' => 'Pemeriksaan Fisik',
                'name' => 'Tekanan Darah (Sistolik)',
                'input_type' => 'Angka',
                'unit' => 'mmHg',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'max' => 120,
                    ],
                    'female' => [
                        'min' => null,
                        'max' => 120,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Pemeriksaan Fisik',
                'name' => 'Tekanan Darah (Diastolik)',
                'input_type' => 'Angka',
                'unit' => 'mmHg',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'max' => 80,
                    ],
                    'female' => [
                        'min' => null,
                        'max' => 80,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Hematologi',
                'name' => 'Hemoglobin (Hb)',
                'input_type' => 'Angka',
                'unit' => 'g/dL',
                'ranges' => [
                    'male' => [
                        'min' => 13.5,
                        'max' => 17.5,
                    ],
                    'female' => [
                        'min' => 12.0,
                        'max' => 15.5,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Hematologi',
                'name' => 'Leukosit (Sel Darah Putih)',
                'input_type' => 'Angka',
                'unit' => '10^3/µL',
                'ranges' => [
                    'male' => [
                        'min' => 4.5,
                        'max' => 11.0,
                    ],
                    'female' => [
                        'min' => 4.5,
                        'max' => 11.0,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Fungsi Metabolik',
                'name' => 'Glukosa Darah Puasa (GDP)',
                'input_type' => 'Angka',
                'unit' => 'mg/dL',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'max' => 100,
                    ],
                    'female' => [
                        'min' => null,
                        'max' => 100,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Profil Lemak',
                'name' => 'Kolesterol Total',
                'input_type' => 'Angka',
                'unit' => 'mg/dL',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'max' => 200,
                    ],
                    'female' => [
                        'min' => null,
                        'max' => 200,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Profil Lemak',
                'name' => 'Kolesterol HDL',
                'input_type' => 'Angka',
                'unit' => 'mg/dL',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'min' => 40,
                    ],
                    'female' => [
                        'min' => null,
                        'min' => 50,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Fungsi Ginjal',
                'name' => 'Kreatinin',
                'input_type' => 'Angka',
                'unit' => 'mg/dL',
                'ranges' => [
                    'male' => [
                        'min' => 0.6,
                        'max' => 1.2,
                    ],
                    'female' => [
                        'min' => 0.5,
                        'max' => 1.1,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Fungsi Hati',
                'name' => 'SGOT (AST)',
                'input_type' => 'Angka',
                'unit' => 'U/L',
                'ranges' => [
                    'male' => [
                        'min' => null,
                        'max' => 40,
                    ],
                    'female' => [
                        'min' => null,
                        'max' => 32,
                    ],
                ],
                'options' => null,
            ],
            [
                'category' => 'Urinalisis',
                'name' => 'Protein Urine',
                'input_type' => 'Pilihan',
                'unit' => null,
                'ranges' => null,
                'options' => ['Negatif', 'Positif'],
            ],
        ];

        foreach ($categories as $category) {
            $categoryx = MCUCategory::create([
                'name' => $category
            ]);

            foreach ($parameters as $parameter) {
                if ($parameter['category'] == $category) {
                    MCUParameter::create([
                        'category_id' => $categoryx->id,
                        'name' => $parameter['name'],
                        'input_type' => $parameter['input_type'],
                        'unit' => $parameter['unit'],
                        'ranges' => $parameter['ranges'],
                        'options' => $parameter['options'],
                    ]);
                }
            }

            // if ($category == 'Fungsi Ginjal') {
            //     $ranges = [
            //         'male' => [
            //             'min' => 0.6,
            //             'max' => 1.2,
            //         ],
            //         'female' => [
            //             'min' => 0.5,
            //             'max' => 1.1,
            //         ],
            //     ];

            //     MCUParameter::create([
            //         'category_id' => $categoryx->id,
            //         'name' => 'Kreatinin',
            //         'input_type' => 'Angka',
            //         'unit' => 'mg/dL',
            //         'ranges' => $ranges,
            //     ]);
            // }
        }

        $path = database_path('seeders/data/prov_kab.csv');
        $rows = array_map('str_getcsv', file($path));

        foreach ($rows as $row) {
            [$provinceName, $regencyName] = $row;

            $province = Province::firstOrCreate(['name' => $provinceName]);

            $regency = Regency::firstOrCreate([
                'province_id' => $province->id,
                'name' => $regencyName,
            ]);
            if ($provinceName === 'Kalimantan Selatan' && $regencyName === 'Tanah Bumbu') {
                Provider::create([
                    'name' => 'RS Marina Permata',
                    'province_id' => $province->id,
                    'regency_id' => $regency->id,
                ]);

                Provider::create([
                    'name' => 'RS Husada',
                    'province_id' => $province->id,
                    'regency_id' => $regency->id,
                ]);
            }
        }
    }
}
