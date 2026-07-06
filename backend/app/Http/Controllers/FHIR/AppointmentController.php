<?php

namespace App\Http\Controllers\FHIR;

use App\Models\FhirResource;
use App\Services\FHIR\FhirService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AppointmentController extends BaseFhirController
{
    protected string $resourceType = 'Appointment';

    public function __construct(FhirService $fhirService)
    {
        parent::__construct($fhirService);
    }

    private function determineDuration(array $data): ?int
    {
        $patientRef = null;
        foreach ($data['participant'] ?? [] as $p) {
            $ref = $p['actor']['reference'] ?? '';
            if (str_starts_with($ref, 'Patient/')) {
                $patientRef = $ref;
                break;
            }
        }
        if (!$patientRef) return null;

        $patientId = str_replace('Patient/', '', $patientRef);
        $coverages = FhirResource::ofType('Coverage')->get();
        $coverage = null;
        foreach ($coverages as $c) {
            $beneficiary = str_replace('Patient/', '', $c->data['beneficiary']['reference'] ?? '');
            if ($beneficiary === $patientId && ($c->data['status'] ?? '') === 'active') {
                $coverage = $c;
                break;
            }
        }
        if (!$coverage) return null;

        $payorRef = $coverage->data['payor'][0]['reference'] ?? '';
        if (!$payorRef) return null;

        $orgId = str_replace('Organization/', '', $payorRef);
        $org = FhirResource::ofType('Organization')->find($orgId);
        if (!$org) return null;

        $orgName = strtolower($org->data['name'] ?? '');
        $insurerKey = match (true) {
            str_contains($orgName, 'cooperativa') => 'salud_cooperativa',
            str_contains($orgName, 'completa') => 'salud_completa',
            default => null,
        };
        if (!$insurerKey) return null;

        $durations = config("fhir.appointment_durations.{$insurerKey}");
        if (!$durations) return null;

        $reasonText = '';
        foreach ($data['reasonCode'] ?? [] as $rc) {
            $reasonText = $rc['text'] ?? $rc['coding'][0]['display'] ?? '';
            if ($reasonText) break;
        }
        $reasonLower = mb_strtolower($reasonText);

        $category = match (true) {
            str_contains($reasonLower, 'telemedicina') || str_contains($reasonLower, 'teleconsulta') => 'telemedicina',
            str_contains($reasonLower, 'control') || str_contains($reasonLower, 'seguimiento') => 'control',
            default => 'primera_vez',
        };

        $serviceTypeText = '';
        foreach ($data['serviceType'] ?? [] as $st) {
            $serviceTypeText = $st['text'] ?? $st['coding'][0]['display'] ?? $st['coding'][0]['code'] ?? '';
            if ($serviceTypeText) break;
        }
        $serviceLower = mb_strtolower($serviceTypeText);

        $level = (str_contains($serviceLower, 'general') || str_contains($serviceLower, 'medicina general'))
            ? 'general'
            : 'especializada';

        $key = "{$category}_{$level}";

        return $durations[$key] ?? null;
    }

    public function book(Request $request)
    {
        $data = [];
        $raw = $request->attributes->get('_raw_body');
        if ($raw) {
            $data = json_decode($raw, true);
        }
        if (!is_array($data)) $data = [];

        return DB::transaction(function () use ($data) {
            $slotId = null;
            if (!empty($data['slot'])) {
                $slotRef = is_string($data['slot']) ? $data['slot'] : ($data['slot'][0]['reference'] ?? null);
                $slotId = str_replace('Slot/', '', $slotRef);
            }

            if ($slotId) {
                $slot = FhirResource::ofType('Slot')->lockForUpdate()->find($slotId);
                if (!$slot || $slot->data['status'] !== 'free') {
                    return response()->json([
                        'resourceType' => 'OperationOutcome',
                        'issue' => [['severity' => 'error', 'code' => 'business-rule', 'diagnostics' => 'Slot no disponible o no encontrado']]
                    ], 422);
                }

                $slotData = $slot->data;
                $slotData['status'] = 'busy';
                $slot->update(['data' => $slotData, 'status' => 'busy']);
            }

            $durationMinutes = $this->determineDuration($data);
            if ($durationMinutes && !empty($data['start'])) {
                $startDate = new \DateTime($data['start']);
                $endDate = (clone $startDate)->modify("+{$durationMinutes} minutes");
                $data['end'] = $endDate->format('c');
            }

            $data['status'] = $data['status'] ?? 'booked';
            $data['created'] = now()->toIso8601String();

            $resource = $this->fhirService->create('Appointment', $data);

            $practitionerRef = '';
            $practitionerDisplay = '';
            foreach ($data['participant'] ?? [] as $p) {
                $ref = $p['actor']['reference'] ?? '';
                if (str_starts_with($ref, 'Practitioner/')) {
                    $practitionerRef = $ref;
                    $practitionerDisplay = $p['actor']['display'] ?? '';
                    break;
                }
            }

            $appointmentResponse = [
                'resourceType' => 'AppointmentResponse',
                'id' => (string) Str::uuid(),
                'appointment' => ['reference' => "Appointment/{$resource->id}"],
                'participantStatus' => 'accepted',
                'comment' => 'Cita agendada exitosamente',
            ];

            if (!empty($data['start'])) $appointmentResponse['start'] = $data['start'];
            if (!empty($data['end'])) $appointmentResponse['end'] = $data['end'];
            if (!empty($data['serviceType'])) $appointmentResponse['serviceType'] = $data['serviceType'];
            if ($practitionerRef) {
                $appointmentResponse['actor'] = [
                    'reference' => $practitionerRef,
                    'display' => $practitionerDisplay,
                ];
            }

            if ($durationMinutes !== null) {
                $appointmentResponse['comment'] = "Cita agendada exitosamente. Duración: {$durationMinutes} min.";
            }

            FhirResource::create([
                'id' => $appointmentResponse['id'],
                'resource_type' => 'AppointmentResponse',
                'fhir_version' => 'R4',
                'data' => $appointmentResponse,
                'status' => 'accepted',
            ]);

            return response()->json([
                'resourceType' => 'Bundle',
                'type' => 'collection',
                'entry' => [
                    ['resource' => $resource->data],
                    ['resource' => $appointmentResponse],
                ],
            ], 201);
        });
    }

    public function cancel(Request $request, $id)
    {
        $body = [];
        $raw = $request->attributes->get('_raw_body');
        if ($raw) {
            $body = json_decode($raw, true);
        }
        if (!is_array($body)) $body = [];

        return DB::transaction(function () use ($id, $body) {
            $resource = FhirResource::ofType('Appointment')->lockForUpdate()->find($id);
            if (!$resource) {
                return response()->json([
                    'resourceType' => 'OperationOutcome',
                    'issue' => [['severity' => 'error', 'code' => 'not-found', 'diagnostics' => "Appointment/$id not found"]]
                ], 404);
            }

            $data = $resource->data;
            $data['status'] = 'cancelled';

            if (!empty($body['reason'])) {
                $data['cancelationReason'] = [
                    'coding' => [['system' => 'http://terminology.hl7.org/CodeSystem/appointment-cancellation-reason', 'code' => $body['reason']]],
                    'text' => $body['reasonText'] ?? 'Cancelado por el sistema',
                ];
            }

            $resource->update([
                'data' => $data,
                'status' => 'cancelled',
                'meta_version_id' => $resource->meta_version_id + 1,
            ]);

            $slotRef = is_string($data['slot'] ?? null) ? $data['slot'] : ($data['slot'][0]['reference'] ?? null);
            if ($slotRef) {
                $slotId = str_replace('Slot/', '', $slotRef);
                $slot = FhirResource::ofType('Slot')->lockForUpdate()->find($slotId);
                if ($slot && ($slot->data['status'] ?? '') === 'busy') {
                    $slotData = $slot->data;
                    $slotData['status'] = 'free';
                    $slot->update(['data' => $slotData, 'status' => 'free']);
                }
            }

            return response()->json($resource->data);
        });
    }
}
