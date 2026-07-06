<?php

namespace App\Http\Controllers\FHIR;

use App\Http\Controllers\Controller;

class MetadataController extends Controller
{
    public function capability()
    {
        return response()->json([
            'resourceType' => 'CapabilityStatement',
            'status' => 'active',
            'date' => now()->toIso8601String(),
            'publisher' => 'ACME Salud',
            'kind' => 'instance',
            'software' => [
                'name' => 'ACME Salud FHIR Server',
                'version' => '1.0.0',
                'releaseDate' => '2026-07-03',
            ],
            'fhirVersion' => '4.0.1',
            'format' => ['application/fhir+json', 'application/json'],
            'rest' => [
                [
                    'mode' => 'server',
                    'resource' => array_map(fn($type) => [
                        'type' => $type,
                        'profile' => "http://hl7.org/fhir/StructureDefinition/$type",
                        'interaction' => [
                            ['code' => 'read'],
                            ['code' => 'search-type'],
                            ['code' => 'create'],
                            ['code' => 'update'],
                            ['code' => 'delete'],
                        ],
                        'searchParam' => [
                            ['name' => '_count', 'type' => 'number'],
                            ['name' => 'status', 'type' => 'string'],
                        ],
                    ], config('fhir.resources')),
                ],
            ],
        ]);
    }
}
