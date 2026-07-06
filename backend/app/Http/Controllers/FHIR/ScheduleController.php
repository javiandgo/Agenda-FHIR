<?php

namespace App\Http\Controllers\FHIR;

use App\Services\FHIR\FhirService;
use Illuminate\Http\Request;

class ScheduleController extends BaseFhirController
{
    protected string $resourceType = 'Schedule';

    public function index(Request $request)
    {
        if ($request->has('actor')) {
            $actorRef = $request->actor;
            $resources = \App\Models\FhirResource::ofType('Schedule')
                ->where('data->actor', 'like', "%$actorRef%")
                ->get();

            return response()->json([
                'resourceType' => 'Bundle',
                'type' => 'searchset',
                'total' => $resources->count(),
                'entry' => $resources->map(fn($r) => ['resource' => $r->data])->toArray(),
            ]);
        }

        return parent::index($request);
    }
}
