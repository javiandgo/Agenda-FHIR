<?php

namespace Database\Seeders;

use App\Models\FhirResource;
use Illuminate\Database\Seeder;

class FhirSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedOrganizations();
        $this->seedLocations();
        $this->seedPractitioners();
        $this->seedPractitionerRoles();
        $this->seedPatients();
        $this->seedCoverages();
        $this->seedHealthcareServices();
        $this->seedSchedules();
        $this->seedSlots();
        $this->seedAppointments();
        $this->seedAppointmentResponses();
    }

    protected function seedOrganizations(): void
    {
        $orgs = [
            [
                'id' => 'org-acme',
                'resourceType' => 'Organization',
                'identifier' => [['system' => 'urn:co:nit', 'value' => '1100155555']],
                'active' => true,
                'type' => [['coding' => [['system' => 'http://terminology.hl7.org/CodeSystem/organization-type', 'code' => 'prov', 'display' => 'Healthcare Provider']]]],
                'name' => 'ACME Salud S.A.',
                'alias' => ['ACME Salud'],
                'telecom' => [
                    ['system' => 'phone', 'value' => '+57 1 3456789'],
                    ['system' => 'email', 'value' => 'contacto@acmesalud.co'],
                ],
                'address' => [['line' => ['Cra 7 # 45-21'], 'city' => 'Bogotá', 'postalCode' => '110111', 'country' => 'CO']],
            ],
            [
                'id' => 'ins-salud-completa',
                'resourceType' => 'Organization',
                'identifier' => [['system' => 'urn:co:nit', 'value' => '800123001-5']],
                'active' => true,
                'type' => [['coding' => [['code' => 'ins', 'display' => 'Insurance Company']]]],
                'name' => 'Salud Completa EPS',
                'alias' => ['Salud Completa'],
                'telecom' => [['system' => 'phone', 'value' => '+57 1 7654321']],
            ],
            [
                'id' => 'ins-salud-cooperativa',
                'resourceType' => 'Organization',
                'identifier' => [['system' => 'urn:co:nit', 'value' => '860007336-3']],
                'active' => true,
                'type' => [['coding' => [['code' => 'ins', 'display' => 'Insurance Company']]]],
                'name' => 'Salud Cooperativa EPS',
                'alias' => ['Salud Cooperativa'],
                'telecom' => [['system' => 'phone', 'value' => '+57 1 3078000']],
            ],
        ];

        foreach ($orgs as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Organization',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedLocations(): void
    {
        $locations = [
            [
                'id' => 'loc-norte',
                'resourceType' => 'Location',
                'identifier' => [['system' => 'urn:co:acme:location', 'value' => '1100155555-1']],
                'status' => 'active',
                'name' => 'Clínica Norte',
                'description' => 'Sede Norte de ACME Salud',
                'mode' => 'instance',
                'telecom' => [['system' => 'phone', 'value' => '+57 1 3456701']],
                'address' => ['line' => ['Av Carrera 45 # 120-10'], 'city' => 'Bogotá', 'country' => 'CO'],
                'physicalType' => ['coding' => [['code' => 'bu', 'display' => 'Building']]],
                'position' => ['latitude' => 4.743, 'longitude' => -74.048],
                'managingOrganization' => ['reference' => 'Organization/org-acme'],
            ],
            [
                'id' => 'loc-centro',
                'resourceType' => 'Location',
                'identifier' => [['system' => 'urn:co:acme:location', 'value' => '1100155555-2']],
                'status' => 'active',
                'name' => 'Clínica Centro',
                'description' => 'Sede Centro de ACME Salud',
                'mode' => 'instance',
                'telecom' => [['system' => 'phone', 'value' => '+57 1 3456702']],
                'address' => ['line' => ['Calle 26 # 30-45'], 'city' => 'Bogotá', 'country' => 'CO'],
                'physicalType' => ['coding' => [['code' => 'bu', 'display' => 'Building']]],
                'position' => ['latitude' => 4.628, 'longitude' => -74.074],
                'managingOrganization' => ['reference' => 'Organization/org-acme'],
            ],
            [
                'id' => 'loc-sur',
                'resourceType' => 'Location',
                'identifier' => [['system' => 'urn:co:acme:location', 'value' => '1100155555-3']],
                'status' => 'active',
                'name' => 'Clínica Sur',
                'description' => 'Sede Sur de ACME Salud',
                'mode' => 'instance',
                'telecom' => [['system' => 'phone', 'value' => '+57 1 3456703']],
                'address' => ['line' => ['Av Boyacá # 60-80'], 'city' => 'Bogotá', 'country' => 'CO'],
                'physicalType' => ['coding' => [['code' => 'bu', 'display' => 'Building']]],
                'position' => ['latitude' => 4.582, 'longitude' => -74.146],
                'managingOrganization' => ['reference' => 'Organization/org-acme'],
            ],
        ];

        foreach ($locations as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Location',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedPractitioners(): void
    {
        $practitioners = [
            [
                'id' => 'prac-casas',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '111222333'],
                    ['system' => 'urn:co:cc', 'value' => '79123456'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Casas', 'given' => ['Gregorio'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 1234567'], ['system' => 'email', 'value' => 'gcasas@acmesalud.co']],
                'gender' => 'male',
                'birthDate' => '1975-05-12',
                'qualification' => [['code' => ['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394537008', 'display' => 'Pediatría']]]]],
            ],
            [
                'id' => 'prac-luna',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '222333444'],
                    ['system' => 'urn:co:cc', 'value' => '80234567'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Luna', 'given' => ['Elmer'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 2345678'], ['system' => 'email', 'value' => 'eluna@acmesalud.co']],
                'gender' => 'male',
                'birthDate' => '1978-09-18',
                'qualification' => [['code' => ['coding' => [['code' => '394586005', 'display' => 'Ginecología y Obstetricia']]]]],
            ],
            [
                'id' => 'prac-chavez',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '333444555'],
                    ['system' => 'urn:co:cc', 'value' => '71234567'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Chávez', 'given' => ['Luis', 'Manuel'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 3456789']],
                'gender' => 'male',
                'birthDate' => '1982-03-25',
                'qualification' => [['code' => ['coding' => [['code' => '394810000', 'display' => 'Nefrología']]]]],
            ],
            [
                'id' => 'prac-silva',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '444777333'],
                    ['system' => 'urn:co:cc', 'value' => '52345678'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Silva', 'given' => ['Alvaro'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 4567890']],
                'gender' => 'male',
                'birthDate' => '1970-11-30',
                'qualification' => [['code' => ['coding' => [['code' => '394589001', 'display' => 'Gastroenterología']]]]],
            ],
            [
                'id' => 'prac-narvaez',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '555222999'],
                    ['system' => 'urn:co:cc', 'value' => '63456789'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Narvaez', 'given' => ['Diego'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 5678901']],
                'gender' => 'male',
                'birthDate' => '1976-07-14',
                'qualification' => [['code' => ['coding' => [['code' => '394593009', 'display' => 'Oncología']]]]],
            ],
            [
                'id' => 'prac-fonseca',
                'resourceType' => 'Practitioner',
                'identifier' => [
                    ['system' => 'urn:co:tarjeta-profesional', 'value' => '777666555'],
                    ['system' => 'urn:co:cc', 'value' => '74567890'],
                ],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Fonseca', 'given' => ['Alonso'], 'prefix' => ['Dr.']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 300 6789012']],
                'gender' => 'male',
                'birthDate' => '1969-02-20',
                'qualification' => [['code' => ['coding' => [['code' => '394802001', 'display' => 'Cardiología']]]]],
            ],
        ];

        foreach ($practitioners as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Practitioner',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedPractitionerRoles(): void
    {
        $roles = [
            [
                'id' => 'role-casas', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-casas', 'display' => 'Dr. Gregorio Casas'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394537008', 'display' => 'Pediatra']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394537008', 'display' => 'Pediatría']]]],
                'location' => [['reference' => 'Location/loc-norte']],
                'availableTime' => [['daysOfWeek' => ['mon', 'tue', 'wed', 'thu', 'fri'], 'availableStartTime' => '08:00:00', 'availableEndTime' => '16:00:00']],
            ],
            [
                'id' => 'role-luna', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-luna', 'display' => 'Dr. Elmer Luna'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394586005', 'display' => 'Ginecólogo']]]],
                'specialty' => [['coding' => [['code' => '394586005', 'display' => 'Ginecología y Obstetricia']]]],
                'location' => [['reference' => 'Location/loc-norte']],
                'availableTime' => [['daysOfWeek' => ['mon', 'wed', 'fri'], 'availableStartTime' => '09:00:00', 'availableEndTime' => '17:00:00']],
            ],
            [
                'id' => 'role-chavez', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-chavez', 'display' => 'Dr. Luis Chávez'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394810000', 'display' => 'Nefrólogo']]]],
                'specialty' => [['coding' => [['code' => '394810000', 'display' => 'Nefrología']]]],
                'location' => [['reference' => 'Location/loc-centro']],
                'availableTime' => [['daysOfWeek' => ['tue', 'thu'], 'availableStartTime' => '08:00:00', 'availableEndTime' => '16:00:00']],
            ],
            [
                'id' => 'role-silva', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-silva', 'display' => 'Dr. Alvaro Silva'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394589001', 'display' => 'Gastroenterólogo']]]],
                'specialty' => [['coding' => [['code' => '394589001', 'display' => 'Gastroenterología']]]],
                'location' => [['reference' => 'Location/loc-centro']],
                'availableTime' => [['daysOfWeek' => ['mon', 'wed', 'fri'], 'availableStartTime' => '10:00:00', 'availableEndTime' => '18:00:00']],
            ],
            [
                'id' => 'role-narvaez', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-narvaez', 'display' => 'Dr. Diego Narvaez'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394593009', 'display' => 'Oncólogo']]]],
                'specialty' => [['coding' => [['code' => '394593009', 'display' => 'Oncología']]]],
                'location' => [['reference' => 'Location/loc-sur']],
                'availableTime' => [['daysOfWeek' => ['tue', 'thu', 'fri'], 'availableStartTime' => '08:00:00', 'availableEndTime' => '14:00:00']],
            ],
            [
                'id' => 'role-fonseca', 'resourceType' => 'PractitionerRole', 'active' => true,
                'practitioner' => ['reference' => 'Practitioner/prac-fonseca', 'display' => 'Dr. Alonso Fonseca'],
                'organization' => ['reference' => 'Organization/org-acme'],
                'code' => [['coding' => [['code' => '394802001', 'display' => 'Cardiólogo']]]],
                'specialty' => [['coding' => [['code' => '394802001', 'display' => 'Cardiología']]]],
                'location' => [['reference' => 'Location/loc-sur']],
                'availableTime' => [['daysOfWeek' => ['mon', 'wed', 'fri'], 'availableStartTime' => '09:00:00', 'availableEndTime' => '17:00:00']],
            ],
        ];

        foreach ($roles as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'PractitionerRole',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedPatients(): void
    {
        $patients = [
            [
                'id' => 'pat-001',
                'resourceType' => 'Patient',
                'identifier' => [['system' => 'urn:co:cc', 'value' => '1020123456']],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Rodríguez', 'given' => ['María', 'Fernanda']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 310 5678901'], ['system' => 'email', 'value' => 'mfrodriguez@correo.co']],
                'gender' => 'female',
                'birthDate' => '1990-03-15',
                'address' => [['line' => ['Calle 45 # 12-30 Apto 203'], 'city' => 'Bogotá', 'country' => 'CO']],
            ],
            [
                'id' => 'pat-002',
                'resourceType' => 'Patient',
                'identifier' => [['system' => 'urn:co:cc', 'value' => '79987654']],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Gómez', 'given' => ['Carlos', 'Andrés']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 320 1234567'], ['system' => 'email', 'value' => 'cagomez@mail.co']],
                'gender' => 'male',
                'birthDate' => '1985-07-22',
                'address' => [['line' => ['Carrera 15 # 80-10'], 'city' => 'Bogotá', 'country' => 'CO']],
            ],
            [
                'id' => 'pat-003',
                'resourceType' => 'Patient',
                'identifier' => [['system' => 'urn:co:cc', 'value' => '52456789']],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Martínez', 'given' => ['Luisa', 'Carolina']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 315 9876543'], ['system' => 'email', 'value' => 'lcmartinez@email.co']],
                'gender' => 'female',
                'birthDate' => '1995-11-08',
                'address' => [['line' => ['Transversal 28 # 55-90'], 'city' => 'Medellín', 'country' => 'CO']],
            ],
            [
                'id' => 'pat-004',
                'resourceType' => 'Patient',
                'identifier' => [['system' => 'urn:co:cc', 'value' => '1030543210']],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'Pérez', 'given' => ['Ana', 'Sofía']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 310 1112233']],
                'gender' => 'female',
                'birthDate' => '2000-01-10',
                'address' => [['line' => ['Cra 10 # 20-30'], 'city' => 'Bogotá', 'country' => 'CO']],
            ],
            [
                'id' => 'pat-005',
                'resourceType' => 'Patient',
                'identifier' => [['system' => 'urn:co:cc', 'value' => '80123456']],
                'active' => true,
                'name' => [['use' => 'official', 'family' => 'López', 'given' => ['Jorge', 'Enrique']]],
                'telecom' => [['system' => 'phone', 'value' => '+57 320 9988776']],
                'gender' => 'male',
                'birthDate' => '1975-06-30',
                'address' => [['line' => ['Calle 100 # 15-20'], 'city' => 'Bogotá', 'country' => 'CO']],
            ],
        ];

        foreach ($patients as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Patient',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedCoverages(): void
    {
        $coverages = [
            [
                'id' => 'cov-001', 'resourceType' => 'Coverage', 'status' => 'active',
                'type' => ['coding' => [['system' => 'http://terminology.hl7.org/CodeSystem/v3-ActCode', 'code' => 'PUBLICPOL', 'display' => 'Contributivo']]],
                'subscriber' => ['reference' => 'Patient/pat-001'],
                'beneficiary' => ['reference' => 'Patient/pat-001'],
                'payor' => [['reference' => 'Organization/ins-salud-completa', 'display' => 'Salud Completa']],
                'period' => ['start' => '2026-01-01', 'end' => '2026-12-31'],
            ],
            [
                'id' => 'cov-002', 'resourceType' => 'Coverage', 'status' => 'active',
                'type' => ['coding' => [['code' => 'SUBSIDPAD', 'display' => 'Subsidiado']]],
                'subscriber' => ['reference' => 'Patient/pat-002'],
                'beneficiary' => ['reference' => 'Patient/pat-002'],
                'payor' => [['reference' => 'Organization/ins-salud-cooperativa', 'display' => 'Salud Cooperativa']],
                'period' => ['start' => '2026-01-01', 'end' => '2026-12-31'],
            ],
            [
                'id' => 'cov-003', 'resourceType' => 'Coverage', 'status' => 'active',
                'type' => ['coding' => [['code' => 'PUBLICPOL', 'display' => 'Contributivo']]],
                'subscriber' => ['reference' => 'Patient/pat-003'],
                'beneficiary' => ['reference' => 'Patient/pat-003'],
                'payor' => [['reference' => 'Organization/ins-salud-completa', 'display' => 'Salud Completa']],
                'period' => ['start' => '2026-01-01', 'end' => '2026-12-31'],
            ],
            [
                'id' => 'cov-004', 'resourceType' => 'Coverage', 'status' => 'active',
                'type' => ['coding' => [['code' => 'PUBLICPOL', 'display' => 'Contributivo']]],
                'subscriber' => ['reference' => 'Patient/pat-004'],
                'beneficiary' => ['reference' => 'Patient/pat-004'],
                'payor' => [['reference' => 'Organization/ins-salud-cooperativa', 'display' => 'Salud Cooperativa']],
                'period' => ['start' => '2026-01-01', 'end' => '2026-12-31'],
            ],
            [
                'id' => 'cov-005', 'resourceType' => 'Coverage', 'status' => 'active',
                'type' => ['coding' => [['code' => 'PUBLICPOL', 'display' => 'Contributivo']]],
                'subscriber' => ['reference' => 'Patient/pat-005'],
                'beneficiary' => ['reference' => 'Patient/pat-005'],
                'payor' => [['reference' => 'Organization/ins-salud-completa', 'display' => 'Salud Completa']],
                'period' => ['start' => '2026-01-01', 'end' => '2026-12-31'],
            ],
        ];

        foreach ($coverages as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Coverage',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedHealthcareServices(): void
    {
        $services = [
            [
                'id' => 'hs-norte-general',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-norte', 'display' => 'Clínica Norte']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'name' => 'Medicina General - Clínica Norte',
                'comment' => 'Servicio de medicina general en Clínica Norte',
            ],
            [
                'id' => 'hs-norte-pediatria',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-norte', 'display' => 'Clínica Norte']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394537008', 'display' => 'Pediatría']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394537008', 'display' => 'Pediatría']]]],
                'name' => 'Pediatría - Clínica Norte',
                'comment' => 'Servicio de pediatría en Clínica Norte',
            ],
            [
                'id' => 'hs-norte-obstetricia',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-norte', 'display' => 'Clínica Norte']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394586005', 'display' => 'Ginecología y Obstetricia']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394586005', 'display' => 'Ginecología y Obstetricia']]]],
                'name' => 'Obstetricia - Clínica Norte',
                'comment' => 'Servicio de obstetricia en Clínica Norte',
            ],
            [
                'id' => 'hs-centro-general',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-centro', 'display' => 'Clínica Centro']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'name' => 'Medicina General - Clínica Centro',
                'comment' => 'Servicio de medicina general en Clínica Centro',
            ],
            [
                'id' => 'hs-centro-nefrologia',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-centro', 'display' => 'Clínica Centro']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394810000', 'display' => 'Nefrología']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394810000', 'display' => 'Nefrología']]]],
                'name' => 'Nefrología - Clínica Centro',
                'comment' => 'Servicio de nefrología en Clínica Centro',
            ],
            [
                'id' => 'hs-centro-gastroenterologia',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-centro', 'display' => 'Clínica Centro']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394589001', 'display' => 'Gastroenterología']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394589001', 'display' => 'Gastroenterología']]]],
                'name' => 'Gastroenterología - Clínica Centro',
                'comment' => 'Servicio de gastroenterología en Clínica Centro',
            ],
            [
                'id' => 'hs-sur-general',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-sur', 'display' => 'Clínica Sur']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394814009', 'display' => 'Medicina general']]]],
                'name' => 'Medicina General - Clínica Sur',
                'comment' => 'Servicio de medicina general en Clínica Sur',
            ],
            [
                'id' => 'hs-sur-oncologia',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-sur', 'display' => 'Clínica Sur']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394593009', 'display' => 'Oncología']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394593009', 'display' => 'Oncología']]]],
                'name' => 'Oncología - Clínica Sur',
                'comment' => 'Servicio de oncología en Clínica Sur',
            ],
            [
                'id' => 'hs-sur-cardiologia',
                'resourceType' => 'HealthcareService',
                'active' => true,
                'providedBy' => ['reference' => 'Organization/org-acme', 'display' => 'ACME Salud S.A.'],
                'location' => [['reference' => 'Location/loc-sur', 'display' => 'Clínica Sur']],
                'type' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394802001', 'display' => 'Cardiología']]]],
                'specialty' => [['coding' => [['system' => 'http://snomed.info/sct', 'code' => '394802001', 'display' => 'Cardiología']]]],
                'name' => 'Cardiología - Clínica Sur',
                'comment' => 'Servicio de cardiología en Clínica Sur',
            ],
        ];

        foreach ($services as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'HealthcareService',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedSchedules(): void
    {
        $schedules = [
            [
                'id' => 'sch-casas-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394537008', 'display' => 'Pediatría']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-casas', 'display' => 'Dr. Gregorio Casas'],
                    ['reference' => 'Location/loc-norte', 'display' => 'Clínica Norte'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
            [
                'id' => 'sch-luna-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394586005', 'display' => 'Ginecología']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-luna', 'display' => 'Dr. Elmer Luna'],
                    ['reference' => 'Location/loc-norte', 'display' => 'Clínica Norte'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
            [
                'id' => 'sch-chavez-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394810000', 'display' => 'Nefrología']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-chavez', 'display' => 'Dr. Luis Chávez'],
                    ['reference' => 'Location/loc-centro', 'display' => 'Clínica Centro'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
            [
                'id' => 'sch-silva-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394589001', 'display' => 'Gastroenterología']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-silva', 'display' => 'Dr. Alvaro Silva'],
                    ['reference' => 'Location/loc-centro', 'display' => 'Clínica Centro'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
            [
                'id' => 'sch-narvaez-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394593009', 'display' => 'Oncología']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-narvaez', 'display' => 'Dr. Diego Narvaez'],
                    ['reference' => 'Location/loc-sur', 'display' => 'Clínica Sur'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
            [
                'id' => 'sch-fonseca-may', 'resourceType' => 'Schedule', 'active' => true,
                'serviceType' => [['coding' => [['code' => '394802001', 'display' => 'Cardiología']]]],
                'actor' => [
                    ['reference' => 'Practitioner/prac-fonseca', 'display' => 'Dr. Alonso Fonseca'],
                    ['reference' => 'Location/loc-sur', 'display' => 'Clínica Sur'],
                ],
                'planningHorizon' => ['start' => '2026-07-01', 'end' => '2026-07-31'],
            ],
        ];

        foreach ($schedules as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Schedule',
                'data' => $data,
                'status' => 'active',
            ]);
        }
    }

    protected function seedSlots(): void
    {
        $slotDefs = [
            [
                'scheduleId' => 'sch-casas-may',
                'prefix' => 'casas',
                'days' => [1, 2, 3, 4, 5],
                'startHour' => 8, 'endHour' => 16,
            ],
            [
                'scheduleId' => 'sch-luna-may',
                'prefix' => 'luna',
                'days' => [1, 3, 5],
                'startHour' => 9, 'endHour' => 17,
            ],
            [
                'scheduleId' => 'sch-chavez-may',
                'prefix' => 'chavez',
                'days' => [2, 4],
                'startHour' => 8, 'endHour' => 16,
            ],
            [
                'scheduleId' => 'sch-silva-may',
                'prefix' => 'silva',
                'days' => [1, 3, 5],
                'startHour' => 10, 'endHour' => 18,
            ],
            [
                'scheduleId' => 'sch-narvaez-may',
                'prefix' => 'narvaez',
                'days' => [2, 4, 5],
                'startHour' => 8, 'endHour' => 14,
            ],
            [
                'scheduleId' => 'sch-fonseca-may',
                'prefix' => 'fonseca',
                'days' => [1, 3, 5],
                'startHour' => 9, 'endHour' => 17,
            ],
        ];

        $slots = [];
        $weekStart = strtotime('2026-07-06 00:00:00-05:00'); // Monday July 6

        foreach ($slotDefs as $def) {
            $counter = 0;
            for ($d = 0; $d < 5; $d++) {
                $dayDate = $weekStart + ($d * 86400);
                $dayOfWeek = date('N', $dayDate);
                if (!in_array($dayOfWeek, $def['days'])) continue;

                $slotDuration = 30 * 60;
                $startSec = $dayDate + ($def['startHour'] * 3600);
                $endSec = $dayDate + ($def['endHour'] * 3600);

                for ($ts = $startSec; $ts + $slotDuration <= $endSec; $ts += $slotDuration) {
                    $counter++;
                    $status = ($counter % 4 === 0) ? 'busy' : 'free';

                    $slots[] = [
                        'id' => 'slot-' . $def['prefix'] . '-' . str_pad($counter, 3, '0', STR_PAD_LEFT),
                        'resourceType' => 'Slot',
                        'schedule' => ['reference' => 'Schedule/' . $def['scheduleId']],
                        'status' => $status,
                        'start' => date('c', $ts),
                        'end' => date('c', $ts + $slotDuration),
                    ];
                }
            }
        }

        foreach ($slots as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Slot',
                'data' => $data,
                'status' => $data['status'],
            ]);
        }
    }

    protected function seedAppointments(): void
    {
        $appointments = [
            [
                'id' => 'apt-001', 'resourceType' => 'Appointment', 'status' => 'booked',
                'serviceType' => [['coding' => [['code' => '394537008', 'display' => 'Pediatría']]]],
                'appointmentType' => ['coding' => [['code' => 'ROUTINE', 'display' => 'Primera vez']]],
                'reasonCode' => [['text' => 'Revisión de rutina pediátrica']],
                'slot' => [['reference' => 'Slot/slot-casas-001']],
                'start' => '2026-07-06T08:00:00-05:00', 'end' => '2026-07-06T08:30:00-05:00',
                'created' => '2026-06-20T10:30:00Z',
                'participant' => [
                    ['actor' => ['reference' => 'Patient/pat-001', 'display' => 'María Fernanda Rodríguez'], 'status' => 'accepted', 'required' => 'required'],
                    ['actor' => ['reference' => 'Practitioner/prac-casas', 'display' => 'Dr. Gregorio Casas'], 'status' => 'accepted', 'required' => 'required'],
                ],
            ],
            [
                'id' => 'apt-002', 'resourceType' => 'Appointment', 'status' => 'pending',
                'serviceType' => [['coding' => [['code' => '394537008', 'display' => 'Pediatría']]]],
                'appointmentType' => ['coding' => [['code' => 'FOLLOWUP', 'display' => 'Control']]],
                'slot' => [['reference' => 'Slot/slot-casas-004']],
                'start' => '2026-07-06T09:00:00-05:00', 'end' => '2026-07-06T09:30:00-05:00',
                'created' => '2026-06-21T14:00:00Z',
                'participant' => [
                    ['actor' => ['reference' => 'Patient/pat-002', 'display' => 'Carlos Andrés Gómez'], 'status' => 'needs-action', 'required' => 'required'],
                    ['actor' => ['reference' => 'Practitioner/prac-casas', 'display' => 'Dr. Gregorio Casas'], 'status' => 'accepted', 'required' => 'required'],
                ],
            ],
        ];

        foreach ($appointments as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'Appointment',
                'data' => $data,
                'status' => $data['status'],
            ]);
        }
    }

    protected function seedAppointmentResponses(): void
    {
        $responses = [
            [
                'id' => 'apr-001', 'resourceType' => 'AppointmentResponse',
                'appointment' => ['reference' => 'Appointment/apt-001'],
                'participantStatus' => 'accepted',
                'actor' => ['reference' => 'Patient/pat-001', 'display' => 'María Fernanda Rodríguez'],
                'comment' => 'Cita confirmada. Pediatría con Dr. Gregorio Casas.',
            ],
        ];

        foreach ($responses as $data) {
            FhirResource::create([
                'id' => $data['id'],
                'resource_type' => 'AppointmentResponse',
                'data' => $data,
                'status' => 'accepted',
            ]);
        }
    }
}
