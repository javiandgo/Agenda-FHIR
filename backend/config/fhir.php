<?php

return [
    'version' => env('FHIR_VERSION', 'R4'),
    'base_url' => env('FHIR_BASE_URL', env('APP_URL') . '/api/fhir'),

    'resources' => [
        'Organization',
        'Location',
        'Practitioner',
        'PractitionerRole',
        'HealthcareService',
        'Schedule',
        'Slot',
        'Patient',
        'Coverage',
        'Appointment',
        'AppointmentResponse',
    ],

    'search' => [
        'default_count' => 50,
        'max_count' => 100,
    ],

    'validation' => [
        'strict' => env('FHIR_STRICT_VALIDATION', true),
    ],

    'appointment_durations' => [
        'salud_cooperativa' => [
            'primera_vez_general' => 30,
            'primera_vez_especializada' => 45,
            'control_general' => 20,
            'control_especializada' => 30,
            'telemedicina_general' => 15,
            'telemedicina_especializada' => 20,
        ],
        'salud_completa' => [
            'primera_vez_general' => 45,
            'primera_vez_especializada' => 60,
            'control_general' => 30,
            'control_especializada' => 45,
            'telemedicina_general' => 25,
            'telemedicina_especializada' => 30,
        ],
    ],

    'acme_salud' => [
        'nit' => '1100155555',
        'name' => 'ACME Salud',
        'locations' => [
            [
                'id' => '1100155555-1',
                'name' => 'Clínica Norte',
                'services' => ['Medicina general', 'Pediatría', 'Obstetricia'],
            ],
            [
                'id' => '1100155555-2',
                'name' => 'Clínica Centro',
                'services' => ['Medicina general', 'Nefrología', 'Gastroenterología'],
            ],
            [
                'id' => '1100155555-3',
                'name' => 'Clínica Sur',
                'services' => ['Medicina general', 'Oncología', 'Cardiología'],
            ],
        ],
    ],
];
