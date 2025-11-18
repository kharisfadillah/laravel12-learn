<?php

namespace Database\Seeders;

use App\Models\MCUCategory;
use App\Models\MCUParameter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CatParamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
        }
    }
}
