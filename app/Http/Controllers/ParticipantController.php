<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Department;
use App\Models\Participant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParticipantController extends Controller
{
    public function index(): Response
    {
        $participants = Participant::with('company:id,name')
            ->with('department:id,name')
            ->orderBy('id')
            ->get();
        // dd($participants->toArray());
        return Inertia::render('Participant/Index', [
            'participants' => $participants,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function create(): Response
    {
        $companies = Company::select('id', 'name')->get();
        $departments = Department::select('id', 'name', 'company_id')->get();

        return Inertia::render('Participant/Create', [
            'companies' => $companies,
            'departments' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'required',
            'name' => 'required|string|max:150',
            'position' => 'nullable|string|max:200',
            'department_id' => 'nullable',
            'birth_date' => 'nullable',
            'gender' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        Participant::create($validated);

        return redirect()->route('participant.index')->with('success', 'Kandidat berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $participant = Participant::findOrFail($id);

        $validated = $request->validate([
            'company_id' => 'required',
            'name' => 'required|string|max:150',
            'position' => 'string|max:200',
            'department_id' => 'nullable',
            'birth_date' => 'nullable',
            'gender' => 'required|string',
            'phone' => 'required|string',
        ]);

        $participant->update($validated);

        return redirect()->route('participant.index')->with('success', 'Kandidat berhasil diubah.');
    }

    public function destroy($id)
    {
        $participant = Participant::findOrFail($id);
        $participant->delete();

        return redirect()->route('participant.index')->with('success', 'Kandidat berhasil dihapus.');
    }

    public function search(Request $request)
    {
        $q = $request->get('q', '');

        // return Participant::query()
        //     ->where('name', 'like', "%$q%")
        //     ->limit(10)
        //     ->get(['id', 'name', 'position']);

        return Participant::query()
            ->with(['company', 'department'])
            ->where('name', 'like', "%$q%")
            ->limit(10)
            ->get();



        // id: string;
        // company_id: string;
        // name: string;
        // position?: string;
        // department_id: string;
        // birth_date?: string;
        // gender: string;
        // phone?: string;
        // company?: Company;
        // department?: Department;
    }
}
