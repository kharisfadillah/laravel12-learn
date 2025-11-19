<?php

namespace App\Http\Controllers;

use App\Models\Company;
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
        // $provinces = Province::select('id', 'code', 'name')->get();

        // return Inertia::render('Province/Index', [
        //     'provinces' => $provinces,
        //     'flash' => [
        //         'success' => session('success'),
        //         'error' => session('error')
        //     ]
        // ]);

        $search = $request->input('search');

        $mcus = MCUIHeader::query()
            ->with(['company:id,name', 'provider'])
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('MCU/Index', [
            'mcus' => $mcus,
            'filters' => [
                'search' => $search,
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
        // dd($request->all());


        // try {
        //     //code...

        //     $validator = Validator::make($request->all(), [
        //         'company_id' => 'required|string',
        //         'mcu_type' => 'required',
        //         'mcu_date' => 'required|date',
        //         'participant_id' => 'required|string',
        //         'provider_id' => 'required|string',
        //         'mcu_param_results' => 'required',
        //         'mcu_param_results.*.id' => 'required|string',
        //         'mcu_param_results.*.result' => 'required|string',
        //     ]);
        // } catch (\Throwable $th) {
        //     //throw $th;
        //     dd($th);
        // }

        $validated = $request->validate([
            'company_id' => 'required|string',
            'mcu_type' => 'required|string',
            'mcu_date' => 'required|date',
            'participant_id' => 'required|string',
            'provider_id' => 'required|string',
            'mcu_param_results' => 'required|array',
            'mcu_param_results.*.id' => 'required|string',
            'mcu_param_results.*.result' => 'required|string',
            'mcu_param_results.*.notes' => 'nullable|string',
        ], [
            'mcu_param_results.*.result.required' => 'Hasil harus diisi',
        ]);

        // dd($validated);

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
                    'ranges' => json_encode($param->ranges),
                    'options' => json_encode($param->options),
                    'result' => $paramResult['result'],
                    'notes' => $paramResult['notes'] ?? null,
                ]);

                // $param = MCUParameter::find($paramResult['id']);

                // MCUIItem::create([
                //     'header_id'     => $header->id,
                //     'parameter_id'  => $paramResult['id'],
                //     'result'        => $paramResult['result'],
                //     'notes'         => $paramResult['notes'] ?? null,
                // ]);
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

    public function destroy($id)
    {
        $province = Province::findOrFail($id);
        $province->delete();

        return redirect()->route('province.index')->with('success', 'Provinsi berhasil dihapus.');
    }
}
