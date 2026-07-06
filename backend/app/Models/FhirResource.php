<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class FhirResource extends Model
{
    use SoftDeletes;

    protected $table = 'fhir_resources';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'resource_type',
        'fhir_version',
        'data',
        'status',
        'meta_version_id',
        'meta_last_updated',
    ];

    protected $casts = [
        'data' => 'array',
        'meta_last_updated' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
            if (empty($model->fhir_version)) {
                $model->fhir_version = 'R4';
            }
            if (empty($model->meta_version_id)) {
                $model->meta_version_id = 1;
            }
            if (empty($model->meta_last_updated)) {
                $model->meta_last_updated = now();
            }
        });
    }

    public function scopeOfType($query, $type)
    {
        return $query->where('resource_type', $type);
    }

    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
