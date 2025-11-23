<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\MCUFHeader;
use App\Models\MCUFItem;
use App\Models\MCUIHeader;
use App\Models\MCUIItem;
use App\Models\MCUParameter;
use App\Models\Participant;
use App\Models\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class MCUController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $conclusion = $request->input('conclusion');

        $mcus = MCUIHeader::query()
            ->with([
                'company:id,name',
                'provider',
                'followup',
            ])
            ->when($conclusion, function ($q1, $conclusion) {
                $q1->where(function ($q2) use ($conclusion) {
                    $q2->whereHas('followup', function ($q3) use ($conclusion) {
                        $q3->whereNotNull('conclusion')
                            ->where('conclusion', $conclusion);
                    })
                        ->orWhere(function ($q4) use ($conclusion) {
                            $q4->whereDoesntHave('followup')
                                ->where('conclusion', $conclusion);
                        })
                        ->orWhere(function ($q5) use ($conclusion) {
                            $q5->whereHas('followup', function ($q5) {
                                $q5->whereNull('conclusion');
                            })
                                ->where('conclusion', $conclusion);
                        });
                });
            })
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $stats = [
            [
                'stat' => 'FIT UNTUK BEKERJA',
                'total' => 0,
                'color' => 'bg-green-300',
            ],
            [
                'stat' => 'FIT DENGAN CATATAN',
                'total' => 0,
                'color' => 'bg-yellow-300',
            ],
            [
                'stat' => 'TEMPORARY UNFIT',
                'total' => 0,
                'color' => 'bg-red-300',
            ],
            [
                'stat' => 'UNFIT',
                'total' => 0,
                'color' => 'bg-gray-300',
            ],
        ];

        $stats_ = DB::table('mcu_i_headers as mcui')
            ->selectRaw('COUNT(mcui.id) as total')
            ->selectRaw('IFNULL(mcuf.conclusion, mcui.conclusion) as stat')
            ->leftJoin('mcu_f_headers as mcuf', function ($join) {
                $join->on('mcui.id', '=', 'mcuf.initial_id')
                    ->whereNull('mcuf.deleted_at');
            })
            ->whereNotNull('mcui.conclusion')
            ->whereNull('mcui.deleted_at')
            ->when($conclusion, function ($q1, $conclusion) {
                $q1->having('stat', '=', $conclusion);
            })
            ->when($search, function ($q2, $search) {
                $q2->where('mcui.name', 'like', "%{$search}%");
            })
            ->groupBy(DB::raw('stat'))
            ->get()
            ->toArray();

        $indexed = [];

        foreach ($stats_ as $n) {
            $indexed[$n->stat] = $n->total;
        }

        foreach ($stats as &$item) {
            if (isset($indexed[$item['stat']])) {
                $item['total'] = $indexed[$item['stat']];
            }
        }

        return Inertia::render('MCU/Index', [
            'mcus' => $mcus,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'conclusion' => $conclusion,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function create()
    {
        $providers = Provider::get();
        // $departments = Department::select('id', 'name', 'company_id')->get();

        return Inertia::render('MCU/Create', [
            'providers' => $providers,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
            // 'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required|string',
            'mcu_type' => 'required|string',
            'mcu_date' => 'required|date',
            'participant_id' => 'required|string',
            'provider_id' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:pdf,jpeg,jpg,png|max:2048',
            'mcu_param_results' => 'required|array',
            'mcu_param_results.*.id' => 'required|string',
            'mcu_param_results.*.result' => 'required|string',
            'mcu_param_results.*.notes' => 'nullable|string',
        ], [
            'company_id.required' => 'Unit usaha belum dipilih',
            'mcu_type.required' => 'Tipe MCU harus diisi',
            'mcu_date.required' => 'Tanggal MCU harus diisi',
            'participant_id.required' => 'Kandidat belum dipilih',
            'provider_id.required' => 'Provider MCU belum dipilih',
            'mcu_param_results.*.result.required' => 'Hasil harus diisi',
        ]);

        DB::beginTransaction();

        try {
            $participant = Participant::with('department')
                ->findOrFail($validated['participant_id']);

            $validated['name'] = $participant->name;
            $validated['position'] = $participant->position;
            $validated['department_id'] = $participant->department_id;
            $validated['department_name'] = data_get($participant, 'department.name');
            $validated['birth_date'] = $participant->birth_date;
            $validated['gender'] = $participant->gender;
            $validated['phone'] = $participant->phone;

            $header = MCUIHeader::create($validated);

            foreach ($validated['mcu_param_results'] as $paramResult) {

                $param = MCUParameter::find($paramResult['id']);
                MCUIItem::create([
                    'header_id' => $header->id,
                    'category_id' => $param->category_id,
                    'parameter_id' => $paramResult['id'],
                    'name' => $param->name,
                    'input_type' => $param->input_type,
                    'unit' => $param->unit,
                    'ranges' => $param->ranges,
                    'options' => $param->options,
                    'result' => $paramResult['result'],
                    'notes' => $paramResult['notes'] ?? null,
                ]);
            }

            if ($request->hasFile('files')) {
                $header->addMultipleMedia($request->file('files'), 'attachments');
            }

            DB::commit();

            return redirect()
                ->route('mcu.index')
                ->with('success', 'Medical Check Up berhasil ditambahkan.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }


    public function update(Request $request, $id)
    {
        $province = Province::findOrFail($id);

        $validated = $request->validate([
            'company_id' => 'required|string|max:10|unique:provinces,code,' . $id,
            'name' => 'required|string|max:100',
        ]);

        $province->update($validated);

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil diubah.');
    }

    public function review($id)
    {
        $mcu = MCUIHeader::with([
            'company',
            'provider',
            'participant.department',
            'items.category',
            'attachments'
        ])
            ->findOrFail($id);

        if ($mcu->conclusion != null) {
            abort(403, 'MCU yang sudah direview, tidak bisa direview lagi');
        }

        return Inertia::render('MCU/Review', [
            'mcu' => $mcu,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function storeReview(Request $request, $id)
    {
        $validated = $request->validate([
            'conclusion' => 'required|string',
            'recommendation' => 'nullable|string',
            'selected_items' => 'nullable|array',
        ], [
            'conclusion.required' => 'Kesimpulan belum dipilih',
        ]);

        $mcu = MCUIHeader::findOrFail($id);

        $mcu->update([
            'conclusion' => $validated['conclusion'],
            'recommendation' => $validated['recommendation'],
        ]);

        return redirect()->route('mcu.index')->with('success', 'Medical Check Up berhasil direview.');
    }

    public function followUp($id)
    {
        $mcu = MCUIHeader::with([
            'company',
            'provider',
            'participant.department',
            'items.category',
            'attachments'
        ])
            ->findOrFail($id);

        $providers = Provider::get();

        return Inertia::render('MCU/FollowUp', [
            'mcu' => $mcu,
            'providers' => $providers,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function storeFollowUp(Request $request, $id)
    {
        $validated = $request->validate([
            'mcu_date' => 'required|date',
            'provider_id' => 'required|string',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:pdf,jpeg,jpg,png|max:2048',
            'mcu_param_results' => 'required|array',
            'mcu_param_results.*.id' => 'required|string',
            'mcu_param_results.*.result' => 'required|string',
            'mcu_param_results.*.notes' => 'nullable|string',
        ], [
            'mcu_date.required' => 'Tanggal MCU harus diisi',
            'provider_id.required' => 'Provider MCU belum dipilih',
            'mcu_param_results.*.result.required' => 'Hasil harus diisi',
        ]);

        DB::beginTransaction();

        try {

            $validated['initial_id'] = $id;

            $header = MCUFHeader::create($validated);

            foreach ($validated['mcu_param_results'] as $paramResult) {

                $param = MCUParameter::find($paramResult['id']);
                MCUFItem::create([
                    'header_id' => $header->id,
                    'category_id' => $param->category_id,
                    'parameter_id' => $paramResult['id'],
                    'name' => $param->name,
                    'input_type' => $param->input_type,
                    'unit' => $param->unit,
                    'ranges' => $param->ranges,
                    'options' => $param->options,
                    'result' => $paramResult['result'],
                    'notes' => $paramResult['notes'] ?? null,
                ]);
            }

            if ($request->hasFile('files')) {
                $header->addMultipleMedia($request->file('files'), 'attachments');
            }

            DB::commit();

            return redirect()
                ->route('mcu.index')
                ->with('success', 'Medical Check Up berhasil ditindak lanjuti.');
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function reviewFollowUp($id)
    {
        $mcu = MCUIHeader::with([
            'company',
            'provider',
            'participant.department',
            'items.category',
            'followup.items.category',
            'followup.attachments',
            'followup.provider',
            'attachments'
        ])
            ->findOrFail($id);

        if ($mcu->conclusion == null) {
            abort(403, 'MCU belum direview awal');
        }

        return Inertia::render('MCU/ReviewFollowUp', [
            'mcu' => $mcu,
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function storeReviewFU(Request $request, $id)
    {
        $validated = $request->validate([
            'conclusion' => 'required|string',
            'recommendation' => 'nullable|string',
        ], [
            'conclusion.required' => 'Kesimpulan belum dipilih',
        ]);

        $mcu = MCUIHeader::findOrFail($id);
        $mcuf = $mcu->followup();

        $mcuf->update([
            'conclusion' => $validated['conclusion'],
            'recommendation' => $validated['recommendation'],
        ]);

        return redirect()->route('mcu.index')->with('success', 'Medical Check Up berhasil direview.');
    }

    public function destroy($id)
    {
        $mcu = MCUIHeader::findOrFail($id);
        $mcu->delete();

        return redirect()->route('mcu.index')->with('success', 'Medical Check Up berhasil dihapus.');
    }
}
