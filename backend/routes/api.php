<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FHIR\OrganizationController;
use App\Http\Controllers\FHIR\LocationController;
use App\Http\Controllers\FHIR\PractitionerController;
use App\Http\Controllers\FHIR\PractitionerRoleController;
use App\Http\Controllers\FHIR\HealthcareServiceController;
use App\Http\Controllers\FHIR\ScheduleController;
use App\Http\Controllers\FHIR\SlotController;
use App\Http\Controllers\FHIR\PatientController;
use App\Http\Controllers\FHIR\CoverageController;
use App\Http\Controllers\FHIR\AppointmentController;
use App\Http\Controllers\FHIR\AppointmentResponseController;
use App\Http\Controllers\FHIR\MetadataController;

Route::prefix('fhir')->middleware('fhir.log')->group(function () {
    Route::get('metadata', [MetadataController::class, 'capability']);

    $resources = [
        'Organization' => OrganizationController::class,
        'Location' => LocationController::class,
        'Practitioner' => PractitionerController::class,
        'PractitionerRole' => PractitionerRoleController::class,
        'HealthcareService' => HealthcareServiceController::class,
        'Schedule' => ScheduleController::class,
        'Slot' => SlotController::class,
        'Patient' => PatientController::class,
        'Coverage' => CoverageController::class,
        'Appointment' => AppointmentController::class,
        'AppointmentResponse' => AppointmentResponseController::class,
    ];

    foreach ($resources as $name => $controller) {
        Route::get($name, [$controller, 'index']);
        Route::post($name, [$controller, 'store']);
        Route::get("{$name}/{id}", [$controller, 'show']);
        Route::put("{$name}/{id}", [$controller, 'update']);
        Route::delete("{$name}/{id}", [$controller, 'destroy']);
        Route::get("{$name}/{id}/_history", [$controller, 'history']);
    }

    Route::post('Appointment/{id}/$cancel', [AppointmentController::class, 'cancel']);
    Route::post('Appointment/$book', [AppointmentController::class, 'book']);
});
