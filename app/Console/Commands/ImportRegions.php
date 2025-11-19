<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Models\Province;
use App\Models\Regency;
use Illuminate\Support\Facades\DB;

class ImportRegions extends Command
{
    protected $signature = 'indo:import-regions 
                                {--source=emsifa : Source (emsifa|wilayah|custom) } 
                                {--force : Force re-import (will truncate tables) }';

    protected $description = 'Import provinces and regencies (kabupaten/kota) from API-wilayah sources (default: emsifa)';

    // Base endpoints for known providers
    protected $endpoints = [
        'emsifa' => [
            'provinces' => 'https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json',
            'regencies'  => 'https://emsifa.github.io/api-wilayah-indonesia/api/regencies/{provinceId}.json',
        ],
        // you can add other providers here
    ];

    public function handle()
    {
        $this->info('Starting import Indonesia regions...');

        $source = $this->option('source') ?: 'emsifa';

        if (!isset($this->endpoints[$source])) {
            $this->error("Unknown source: {$source}");
            return 1;
        }

        $provincesUrl = $this->endpoints[$source]['provinces'];
        $regenciesUrlTemplate = $this->endpoints[$source]['regencies'];

        if ($this->option('force')) {
            if ($this->confirm('This will truncate provinces and regencies tables. Continue?')) {
                DB::statement('SET FOREIGN_KEY_CHECKS=0;');
                Province::truncate();
                Regency::truncate();
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
                $this->info('Tables truncated.');
            } else {
                $this->info('Aborted.');
                return 0;
            }
        }

        // Fetch provinces
        $this->info("Fetching provinces from: {$provincesUrl}");
        $resp = Http::get($provincesUrl);

        if (!$resp->ok()) {
            $this->error("Failed to fetch provinces. HTTP status: {$resp->status()}");
            return 1;
        }

        $provinces = $resp->json();

        // dd($provinces);

        if (empty($provinces) || !is_array($provinces)) {
            $this->error("Invalid provinces response.");
            return 1;
        }

        $bar = $this->output->createProgressBar(count($provinces));
        $bar->start();

        foreach ($provinces as $p) {
            // API fields: id, name
            $provApiId = $p['id'] ?? null;
            $provName = $p['name'] ?? null;

            if (!$provApiId || !$provName) {
                $this->line("\nSkipping invalid province record.");
                $bar->advance();
                continue;
            }

            // Define code: by default use slug uppercase, and store api id separately if needed
            // You can change this mapping to fit your expected 'code' format.
            // $provCode = Str::upper(Str::slug($provName, '_')); // example: KALIMANTAN_SELATAN
            // if you prefer to use api id as code: $provCode = $provApiId;

            // firstOrCreate to avoid duplicates
            $province = Province::firstOrCreate(
                ['name' => $provName]
            );

            // Fetch regencies for this province
            $regUrl = str_replace('{provinceId}', $provApiId, $regenciesUrlTemplate);
            $regResp = Http::get($regUrl);

            if ($regResp->ok()) {
                $regencies = $regResp->json();
                if (is_array($regencies)) {
                    foreach ($regencies as $r) {
                        // r: id, province_id, name
                        $regApiId = $r['id'] ?? null;
                        $regName = $r['name'] ?? null;

                        if (!$regApiId || !$regName) continue;

                        // $regCode = Str::upper(Str::slug($regName, '_'));

                        Regency::create(
                            [
                                'province_id' => $province->id,
                                // 'code' => $regCode,
                                'name' => $regName,
                            ]
                        );
                    }
                }
            } else {
                $this->warn("\nWarning: failed to fetch regencies for province {$provName} ({$provApiId}). HTTP {$regResp->status()}");
            }

            $bar->advance();
        }

        $bar->finish();
        $this->line("\n");
        $this->info('Import finished.');

        return 0;
    }
}
