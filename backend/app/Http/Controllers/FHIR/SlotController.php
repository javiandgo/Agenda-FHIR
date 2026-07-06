<?php

namespace App\Http\Controllers\FHIR;

use App\Models\FhirResource;
use Illuminate\Http\Request;

class SlotController extends BaseFhirController
{
    protected string $resourceType = 'Slot';

    public function index(Request $request)
    {
        $query = FhirResource::ofType('Slot');

        if ($request->has('schedule')) {
            $query->where('data->schedule->reference', $request->schedule);
        }

        if ($request->has('status')) {
            $query->where('data->status', $request->status);
        }

        if ($request->has('start')) {
            $query->where('data->start', '>=', $request->start);
        }

        if ($request->has('end')) {
            $query->where('data->end', '<=', $request->end);
        }

        $resources = $query->orderBy('data->start')->get();

        return response()->json([
            'resourceType' => 'Bundle',
            'type' => 'searchset',
            'total' => $resources->count(),
            'entry' => $resources->map(fn($r) => ['resource' => $r->data])->toArray(),
        ]);
    }
}
