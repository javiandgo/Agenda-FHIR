# Guía de Instalación - Laravel FHIR Server

## Requisitos del Sistema

### Software Necesario

- **PHP** 8.2 o superior
- **Composer** 2.x
- **PostgreSQL** 15 o superior
- **Redis** 7 o superior
- **Node.js** 18 o superior (para assets frontend)
- **Git**

### Extensiones PHP Requeridas

```ini
extension=pdo_pgsql
extension=pgsql
extension=redis
extension=mbstring
extension=openssl
extension=json
extension=xml
extension=curl
extension=zip
```

## Instalación Paso a Paso

### 1. Instalar Composer

```bash
# Windows: Descargar de https://getcomposer.org/download/

# Linux/Mac:
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Crear Proyecto Laravel 11

```bash
# Navegar a xampp/htdocs
cd c:\xampp\htdocs\Agenda-FHIR

# Crear nuevo proyecto Laravel
composer create-project laravel/laravel:^11.0 backend

# Entrar al directorio
cd backend
```

### 3. Instalar Dependencias FHIR

```bash
# Librería FHIR para PHP
composer require dakujem/fhir-php

# Paquetes adicionales recomendados
composer require laravel/passport        # OAuth2
composer require spatie/laravel-permission  # Roles y permisos
composer require laravel/horizon         # Queue management
composer require predis/predis          # Redis client
```

### 4. Configurar PostgreSQL

#### Windows (XAMPP)

```bash
# Descargar PostgreSQL de https://www.postgresql.org/download/windows/
# Instalar y configurar puerto 5432

# Crear base de datos
psql -U postgres
CREATE DATABASE agenda_fhir;
CREATE USER agenda_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE agenda_fhir TO agenda_user;
\q
```

#### Habilitar extensiones

```sql
-- Conectar a la base de datos
\c agenda_fhir

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 5. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Generar key de aplicación
php artisan key:generate
```

Editar `.env`:

```env
APP_NAME="ACME Salud FHIR Server"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Base de datos PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=agenda_fhir
DB_USERNAME=agenda_user
DB_PASSWORD=secure_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# FHIR Configuration
FHIR_VERSION=R4
FHIR_BASE_URL="${APP_URL}/api/fhir"
```

### 6. Instalar y Configurar Redis

#### Windows

```bash
# Descargar desde https://github.com/microsoftarchive/redis/releases
# Instalar como servicio de Windows
# O usar Docker:
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

#### Linux

```bash
sudo apt-get update
sudo apt-get install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

Verificar instalación:

```bash
redis-cli ping
# Debe responder: PONG
```

### 7. Crear Estructura de Directorios

```bash
# Crear directorios para FHIR
mkdir -p app/Http/Controllers/FHIR
mkdir -p app/Http/Resources/FHIR
mkdir -p app/Services/FHIR
mkdir -p app/Models/FHIR
mkdir -p database/seeders/FHIR
mkdir -p config
mkdir -p docs/ejemplos-fhir
```

### 8. Crear Archivo de Configuración FHIR

Crear `config/fhir.php`:

```php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | FHIR Version
    |--------------------------------------------------------------------------
    */
    'version' => env('FHIR_VERSION', 'R4'),

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    */
    'base_url' => env('FHIR_BASE_URL', env('APP_URL') . '/api/fhir'),

    /*
    |--------------------------------------------------------------------------
    | Supported Resources
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | Search Parameters
    |--------------------------------------------------------------------------
    */
    'search' => [
        'default_count' => 50,
        'max_count' => 100,
    ],

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */
    'validation' => [
        'strict' => env('FHIR_STRICT_VALIDATION', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Time Slots Configuration (minutos)
    |--------------------------------------------------------------------------
    */
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

    /*
    |--------------------------------------------------------------------------
    | ACME Salud Organization Data
    |--------------------------------------------------------------------------
    */
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
```

### 9. Ejecutar Migraciones

Primero, crear la migración base:

```bash
php artisan make:migration create_fhir_resources_table
```

Editar el archivo de migración:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Habilitar extensión UUID
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

            // Índices
            $table->index(['resource_type', 'status']);
            $table->index('created_at');
        });

        // Índice GIN para búsquedas JSON
        DB::statement('CREATE INDEX idx_fhir_data_gin ON fhir_resources USING GIN (data)');

        // Índices específicos
        DB::statement("CREATE INDEX idx_appointment_patient ON fhir_resources USING GIN ((data->'participant')) WHERE resource_type = 'Appointment'");
        DB::statement("CREATE INDEX idx_slot_schedule ON fhir_resources ((data->>'schedule')) WHERE resource_type = 'Slot'");
    }

    public function down(): void
    {
        Schema::dropIfExists('fhir_resources');
    }
};
```

Ejecutar migración:

```bash
php artisan migrate
```

### 10. Configurar Rutas API

Editar `routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FHIR;

Route::prefix('fhir')->group(function () {
    // Metadata endpoint
    Route::get('metadata', [FHIR\MetadataController::class, 'capability']);

    // FHIR Resources
    $resources = [
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
    ];

    foreach ($resources as $resource) {
        $controller = "FHIR\\{$resource}Controller";

        Route::get($resource, [$controller, 'index']);
        Route::post($resource, [$controller, 'store']);
        Route::get("{$resource}/{id}", [$controller, 'show']);
        Route::put("{$resource}/{id}", [$controller, 'update']);
        Route::delete("{$resource}/{id}", [$controller, 'destroy']);
        Route::get("{$resource}/{id}/_history", [$controller, 'history']);
    }

    // Custom operations
    Route::post('Appointment/{id}/$cancel', [FHIR\AppointmentController::class, 'cancel']);
    Route::post('Appointment/$book', [FHIR\AppointmentController::class, 'book']);
});
```

### 11. Verificar Instalación

```bash
# Iniciar servidor de desarrollo
php artisan serve

# En otra terminal, probar endpoint
curl http://localhost:8000/api/fhir/metadata
```

### 12. Instalar Horizon (Opcional - para queues)

```bash
php artisan horizon:install

# Publicar configuración
php artisan vendor:publish --provider="Laravel\Horizon\HorizonServiceProvider"

# Iniciar Horizon
php artisan horizon
```

## Próximos Pasos

1. **Crear controladores FHIR** para cada recurso
2. **Implementar modelos** Eloquent
3. **Crear seeders** con datos de demostración
4. **Implementar validación FHIR**
5. **Configurar OAuth2** con Laravel Passport
6. **Desarrollar frontend** (React/Flutter)

## Troubleshooting

### Error: "could not find driver"

```bash
# Verificar que pdo_pgsql esté habilitado en php.ini
php -m | grep pgsql

# En XAMPP, editar php.ini y descomentar:
extension=pdo_pgsql
extension=pgsql
```

### Redis connection error

```bash
# Verificar que Redis esté corriendo
redis-cli ping

# Si no responde, iniciar servicio
# Windows: Iniciar desde servicios de Windows
# Linux: sudo systemctl start redis-server
```

### PostgreSQL authentication failed

```bash
# Verificar credenciales en .env
# Reiniciar PostgreSQL
# Windows: Servicios > PostgreSQL > Reiniciar
# Linux: sudo systemctl restart postgresql
```

## Recursos Adicionales

- [Laravel Documentation](https://laravel.com/docs/11.x)
- [FHIR R4 Specification](https://www.hl7.org/fhir/R4/)
- [PostgreSQL JSON Functions](https://www.postgresql.org/docs/current/functions-json.html)
- [Redis Documentation](https://redis.io/documentation)
