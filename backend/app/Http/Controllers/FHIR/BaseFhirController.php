<?php

namespace App\Http\Controllers\FHIR;

use App\Http\Controllers\Controller;
use App\Services\FHIR\FhirService;
use Illuminate\Http\Request;

class BaseFhirController extends Controller
{
    protected FhirService $fhirService;
    protected string $resourceType;

    public function __construct(FhirService $fhirService)
    {
        $this->fhirService = $fhirService;
    }

    public function index(Request $request)
    {
        $result = $this->fhirService->search($this->resourceType, $request);
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $data = [];
        $raw = $request->attributes->get('_raw_body');
        if ($raw) {
            $data = json_decode($raw, true);
        }
        if (!is_array($data)) $data = [];
        $resource = $this->fhirService->create($this->resourceType, $data);
        return response()->json($resource->data, 201);
    }

    public function show($id)
    {
        $resource = $this->fhirService->read($this->resourceType, $id);
        if (!$resource) {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [['severity' => 'error', 'code' => 'not-found', 'diagnostics' => "{$this->resourceType}/{$id} not found"]]
            ], 404);
        }
        return response()->json($resource->data);
    }

    public function update(Request $request, $id)
    {
        $data = [];
        $raw = $request->attributes->get('_raw_body');
        if ($raw) {
            $data = json_decode($raw, true);
        }
        if (!is_array($data)) $data = [];
        $resource = $this->fhirService->update($this->resourceType, $id, $data);
        if (!$resource) {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [['severity' => 'error', 'code' => 'not-found', 'diagnostics' => "{$this->resourceType}/{$id} not found"]]
            ], 404);
        }
        return response()->json($resource->data);
    }

    public function destroy($id)
    {
        $deleted = $this->fhirService->delete($this->resourceType, $id);
        if (!$deleted) {
            return response()->json([
                'resourceType' => 'OperationOutcome',
                'issue' => [['severity' => 'error', 'code' => 'not-found', 'diagnostics' => "{$this->resourceType}/{$id} not found"]]
            ], 404);
        }
        return response()->json(null, 204);
    }

    public function history($id)
    {
        $result = $this->fhirService->history($this->resourceType, $id);
        return response()->json($result);
    }
}
