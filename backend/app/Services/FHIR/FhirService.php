<?php

namespace App\Services\FHIR;

use App\Models\FhirResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FhirService
{
    public function search(string $resourceType, Request $request): array
    {
        $query = FhirResource::ofType($resourceType);

        if ($request->has('status')) {
            $query->withStatus($request->status);
        }

        if ($request->has('_count')) {
            $query->take(min($request->_count, 100));
        } else {
            $query->take(50);
        }

        $resources = $query->orderBy('created_at', 'desc')->get();

        return [
            'resourceType' => 'Bundle',
            'type' => 'searchset',
            'total' => $resources->count(),
            'entry' => $resources->map(fn($r) => [
                'resource' => $r->data,
            ])->toArray(),
        ];
    }

    public function create(string $resourceType, array $data): FhirResource
    {
        $id = $data['id'] ?? (string) Str::uuid();
        $data['id'] = $id;
        $data['resourceType'] = $resourceType;

        $status = 'active';
        if (isset($data['status'])) {
            $status = $data['status'];
        } elseif (isset($data['active'])) {
            $status = $data['active'] ? 'active' : 'inactive';
        }

        return FhirResource::create([
            'id' => $id,
            'resource_type' => $resourceType,
            'fhir_version' => 'R4',
            'data' => $data,
            'status' => $status,
        ]);
    }

    public function read(string $resourceType, string $id): ?FhirResource
    {
        return FhirResource::ofType($resourceType)->find($id);
    }

    public function update(string $resourceType, string $id, array $data): ?FhirResource
    {
        $resource = FhirResource::ofType($resourceType)->find($id);
        if (!$resource) return null;

        $data['id'] = $id;
        $data['resourceType'] = $resourceType;

        $status = $resource->status;
        if (isset($data['status'])) {
            $status = $data['status'];
        } elseif (isset($data['active'])) {
            $status = $data['active'] ? 'active' : 'inactive';
        }

        $resource->update([
            'data' => $data,
            'status' => $status,
            'meta_version_id' => $resource->meta_version_id + 1,
            'meta_last_updated' => now(),
        ]);

        return $resource;
    }

    public function delete(string $resourceType, string $id): bool
    {
        $resource = FhirResource::ofType($resourceType)->find($id);
        if (!$resource) return false;

        return $resource->delete();
    }

    public function history(string $resourceType, string $id): array
    {
        $current = FhirResource::ofType($resourceType)->find($id);

        return [
            'resourceType' => 'Bundle',
            'type' => 'history',
            'total' => $current ? 1 : 0,
            'entry' => $current ? [['resource' => $current->data]] : [],
        ];
    }
}
