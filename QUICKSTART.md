# 🚀 Guía de Inicio Rápido

## Sistema de Agenda FHIR - ACME Salud

Esta guía te llevará desde cero hasta tener el ambiente de desarrollo funcionando en **menos de 1 hora**.

---

## ⚡ Setup en 5 Pasos

### Paso 1: Verificar Requisitos (5 min)

```bash
# Verificar versiones
php --version      # Debe ser >= 8.2
composer --version # Debe ser >= 2.0
psql --version     # Debe ser >= 15
redis-cli --version # Debe ser >= 7

# Si falta alguno, instalar desde:
# PHP: https://www.php.net/downloads
# Composer: https://getcomposer.org/download/
# PostgreSQL: https://www.postgresql.org/download/
# Redis: https://redis.io/download (Windows: https://github.com/tporadowski/redis/releases)
```

### Paso 2: Crear Proyecto Laravel (10 min)

```bash
# Navegar al directorio
cd c:\xampp\htdocs\Agenda-FHIR

# Crear proyecto Laravel
composer create-project laravel/laravel:^11.0 backend

# Entrar al directorio
cd backend

# Instalar dependencias FHIR
composer require dakujem/fhir-php
composer require laravel/passport
composer require predis/predis
```

### Paso 3: Configurar Base de Datos (10 min)

```bash
# Abrir PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE agenda_fhir;
CREATE USER agenda_user WITH ENCRYPTED PASSWORD 'AgendaFHIR2026!';
GRANT ALL PRIVILEGES ON DATABASE agenda_fhir TO agenda_user;

# Habilitar extensiones
\c agenda_fhir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
\q
```

Editar `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=agenda_fhir
DB_USERNAME=agenda_user
DB_PASSWORD=AgendaFHIR2026!

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Paso 4: Crear Migración Base (15 min)

```bash
# Crear migración
php artisan make:migration create_fhir_resources_table

# Generar key
php artisan key:generate
```

Editar archivo creado en `database/migrations/`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        Schema::create('fhir_resources', function (Blueprint $table) {
            $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            $table->string('resource_type', 50)->index();
            $table->string('fhir_version', 10)->default('R4');
            $table->jsonb('data');
            $table->integer('meta_version_id')->default(1);
            $table->timestamp('meta_last_updated')->useCurrent();
            $table->string('status', 20)->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        DB::statement('CREATE INDEX idx_fhir_data_gin ON fhir_resources USING GIN (data)');
    }

    public function down(): void
    {
        Schema::dropIfExists('fhir_resources');
    }
};
```

```bash
# Ejecutar migración
php artisan migrate
```

### Paso 5: Iniciar Servidor (5 min)

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Redis (si no está como servicio)
redis-server

# Abrir en navegador
# http://localhost:8000
```

---

## 🎯 Verificación de Instalación

### Test 1: Laravel funciona

```bash
curl http://localhost:8000
# Debe mostrar página de bienvenida de Laravel
```

### Test 2: Base de datos conecta

```bash
php artisan tinker

# Dentro de tinker:
DB::connection()->getPdo();
# Debe mostrar objeto PDO sin errores
exit;
```

### Test 3: Redis funciona

```bash
redis-cli ping
# Debe responder: PONG
```

---

## 📂 Crear Estructura FHIR

```bash
# Crear directorios
mkdir -p app/Http/Controllers/FHIR
mkdir -p app/Http/Resources/FHIR
mkdir -p app/Services/FHIR
mkdir -p app/Models/FHIR
mkdir -p config

# Crear archivo de configuración
cat > config/fhir.php << 'EOF'
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

    'appointment_durations' => [
        'salud_cooperativa' => [
            'primera_vez_general' => 30,
            'primera_vez_especializada' => 45,
            'control_general' => 20,
            'control_especializada' => 30,
        ],
        'salud_completa' => [
            'primera_vez_general' => 45,
            'primera_vez_especializada' => 60,
            'control_general' => 30,
            'control_especializada' => 45,
        ],
    ],
];
EOF
```

---

## 🔨 Crear Primer Endpoint FHIR

### 1. Crear Modelo

```bash
php artisan make:model FhirResource
```

Editar `app/Models/FhirResource.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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
    ];

    protected $casts = [
        'data' => 'array',
        'meta_last_updated' => 'datetime',
    ];
}
```

### 2. Crear Controlador

```bash
php artisan make:controller FHIR/OrganizationController
```

Editar `app/Http/Controllers/FHIR/OrganizationController.php`:

```php
<?php

namespace App\Http\Controllers\FHIR;

use App\Http\Controllers\Controller;
use App\Models\FhirResource;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrganizationController extends Controller
{
    public function index()
    {
        $organizations = FhirResource::where('resource_type', 'Organization')->get();

        return response()->json([
            'resourceType' => 'Bundle',
            'type' => 'searchset',
            'total' => $organizations->count(),
            'entry' => $organizations->map(fn($org) => [
                'resource' => $org->data
            ])
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $data['id'] = $data['id'] ?? Str::uuid()->toString();

        $resource = FhirResource::create([
            'id' => $data['id'],
            'resource_type' => 'Organization',
            'fhir_version' => 'R4',
            'data' => $data,
            'status' => $data['active'] ?? true ? 'active' : 'inactive',
        ]);

        return response()->json($resource->data, 201);
    }

    public function show($id)
    {
        $resource = FhirResource::where('resource_type', 'Organization')
            ->findOrFail($id);

        return response()->json($resource->data);
    }
}
```

### 3. Crear Rutas

Editar `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FHIR\OrganizationController;

Route::prefix('fhir')->group(function () {
    Route::get('Organization', [OrganizationController::class, 'index']);
    Route::post('Organization', [OrganizationController::class, 'store']);
    Route::get('Organization/{id}', [OrganizationController::class, 'show']);
});
```

---

## 🧪 Probar el API

### Crear organización (POST)

```bash
curl -X POST http://localhost:8000/api/fhir/Organization \
  -H "Content-Type: application/json" \
  -d '{
    "resourceType": "Organization",
    "id": "acme-salud",
    "identifier": [{
      "system": "urn:co:nit",
      "value": "1100155555"
    }],
    "active": true,
    "name": "ACME Salud",
    "telecom": [{
      "system": "phone",
      "value": "+57 1 234 5678"
    }]
  }'
```

### Listar organizaciones (GET)

```bash
curl http://localhost:8000/api/fhir/Organization
```

### Obtener una organización (GET)

```bash
curl http://localhost:8000/api/fhir/Organization/acme-salud
```

---

## ✅ Checklist de Verificación

- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] PostgreSQL 15+ instalado y corriendo
- [ ] Redis 7+ instalado y corriendo
- [ ] Proyecto Laravel creado
- [ ] Dependencias instaladas
- [ ] Base de datos creada
- [ ] Migraciones ejecutadas
- [ ] Archivo config/fhir.php creado
- [ ] Modelo FhirResource creado
- [ ] Controlador Organization creado
- [ ] Rutas API configuradas
- [ ] Servidor Laravel corriendo
- [ ] API responde a peticiones

---

## 🐛 Troubleshooting Rápido

### Error: "could not find driver"

```bash
# Verificar extensión pdo_pgsql en php.ini
php -m | grep pgsql

# Si no aparece, editar php.ini y descomentar:
extension=pdo_pgsql
extension=pgsql

# Reiniciar servidor
```

### Error: "Connection refused" (PostgreSQL)

```bash
# Verificar que PostgreSQL está corriendo
# Windows: Servicios > PostgreSQL
# Linux: sudo systemctl status postgresql
# Mac: brew services list

# Verificar puerto
netstat -ano | findstr :5432
```

### Error: "Connection refused" (Redis)

```bash
# Iniciar Redis
# Windows: Iniciar desde Servicios o ejecutar redis-server.exe
# Linux: sudo systemctl start redis-server
# Mac: brew services start redis

# Verificar
redis-cli ping
```

### Error de migración

```bash
# Limpiar y volver a migrar
php artisan migrate:fresh

# Si persiste, verificar conexión DB
php artisan tinker
DB::connection()->getPdo();
```

---

## 📚 Próximos Pasos

Una vez tengas el ambiente funcionando:

1. **Estudiar la arquitectura**  
   Leer [ARQUITECTURA.md](ARQUITECTURA.md)

2. **Revisar ejemplos FHIR**  
   Ver [docs/ejemplos-fhir/](docs/ejemplos-fhir/)

3. **Implementar más recursos**  
   Crear controladores para Location, Practitioner, etc.

4. **Agregar validación FHIR**  
   Implementar schemas de validación

5. **Configurar OAuth 2.0**  
   Instalar Laravel Passport

6. **Desarrollar frontend**  
   React o Flutter según preferencia

---

## 💡 Tips de Desarrollo

### Usar Postman para testing

```bash
# Importar colección FHIR
# Crear colección con ejemplos del proyecto
# Guardar en Git para compartir con equipo
```

### Habilitar logs de queries

Editar `config/logging.php` para debug:

```php
'channels' => [
    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => 'debug',
        'days' => 14,
    ],
],
```

### Usar Laravel Telescope (Opcional)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Acceder a: http://localhost:8000/telescope
```

---

## 🎓 Recursos de Aprendizaje

- **Laravel Docs:** https://laravel.com/docs/11.x
- **FHIR Docs:** https://www.hl7.org/fhir/R4/
- **PostgreSQL JSON:** https://www.postgresql.org/docs/current/functions-json.html
- **Laracasts:** https://laracasts.com (tutoriales Laravel)

---

## 📞 Soporte

Si encuentras problemas:

1. Revisar [INSTALACION.md](INSTALACION.md) para más detalles
2. Buscar en StackOverflow con tags: laravel, fhir, postgresql
3. Revisar logs: `storage/logs/laravel.log`
4. Contactar: desarrollo@acmesalud.com

---

**¡Felicitaciones! 🎉**  
Ya tienes el ambiente de desarrollo funcionando.

**Siguiente paso:** Implementar el resto de recursos FHIR siguiendo el mismo patrón.

---

**Última actualización:** 20 de abril de 2026  
**Tiempo estimado total:** 45-60 minutos  
**Nivel de dificultad:** Intermedio
