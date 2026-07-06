<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fhir_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('resource_type', 50)->index();
            $table->string('fhir_version', 10)->default('R4');
            $table->json('data');
            $table->integer('meta_version_id')->default(1);
            $table->timestamp('meta_last_updated')->useCurrent();
            $table->string('status', 20)->nullable()->index();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['resource_type', 'status']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fhir_resources');
    }
};
