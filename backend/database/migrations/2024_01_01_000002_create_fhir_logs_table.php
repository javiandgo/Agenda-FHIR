<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fhir_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('method', 10);
            $table->string('endpoint', 500);
            $table->json('request_headers')->nullable();
            $table->json('request_body')->nullable();
            $table->integer('response_status')->nullable();
            $table->json('response_headers')->nullable();
            $table->json('response_body')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index('method');
            $table->index('response_status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fhir_logs');
    }
};
