# Presentación del Proyecto - Sistema de Agenda FHIR

## ACME Salud

**Duración:** 30 minutos  
**Fecha:** 20 de abril de 2026

---

## 📋 Índice de la Presentación

1. Introducción (3 min)
2. Contexto del Negocio (4 min)
3. Arquitectura del Sistema (8 min)
4. Modelo de Datos FHIR (6 min)
5. Interfaces Gráficas (5 min)
6. Plan de Implementación (3 min)
7. Conclusiones y Q&A (1 min + preguntas)

---

## SLIDE 1: Portada

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║              SISTEMA DE AGENDA FHIR                       ║
║                   ACME Salud                              ║
║                                                           ║
║       Unificación de Agendas mediante                     ║
║         Estándar de Interoperabilidad                     ║
║                                                           ║
║                                                           ║
║                  Equipo de Desarrollo                     ║
║              Proyecto Integrador - 2026                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Notas del presentador:**

- Presentar al equipo
- Mencionar objetivo del proyecto
- Duración: 30 minutos

---

## SLIDE 2: Problemática

```
╔═══════════════════════════════════════════════════════════╗
║  EL DESAFÍO                                               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ACME Salud cuenta con:                                   ║
║                                                           ║
║  📍 3 Puntos de Atención                                  ║
║     (Norte, Centro, Sur)                                  ║
║                                                           ║
║  📱 4 Canales de Solicitud                                ║
║     (Web, Móvil, Call Center, Ventanilla)                 ║
║                                                           ║
║  ⚕️  6 Especialistas de Alta Demanda                      ║
║                                                           ║
║  🏥 2 Aseguradoras en Convenio                            ║
║                                                           ║
║  ❌ PROBLEMA:                                             ║
║  Sistema fragmentado sin interoperabilidad                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Notas:**

- Enfatizar la fragmentación actual
- Mencionar dificultades de coordinación
- Problemas de doble agendamiento

---

## SLIDE 3: Solución Propuesta

```
╔═══════════════════════════════════════════════════════════╗
║  SOLUCIÓN: SISTEMA FHIR UNIFICADO                         ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ✅ Servidor Central FHIR                                 ║
║     Punto único de verdad para agendas                    ║
║                                                           ║
║  ✅ Estándar Internacional                                ║
║     FHIR R4 (Fast Healthcare Interoperability Resources)  ║
║                                                           ║
║  ✅ Integración Multicanal                                ║
║     API REST unificada                                    ║
║                                                           ║
║  ✅ Gestión Inteligente de Slots                          ║
║     Tiempos según aseguradora                             ║
║                                                           ║
║  ✅ Trazabilidad Completa                                 ║
║     Auditoría de todas las operaciones                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 4: Arquitectura General

```
╔═══════════════════════════════════════════════════════════╗
║  ARQUITECTURA DEL SISTEMA                                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ ║
║  │   Web    │  │  Mobile  │  │   Call   │  │  HIS     │ ║
║  │  React   │  │  Flutter │  │  Center  │  │ Ventani. │ ║
║  └─────┬────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘ ║
║        └──────────────┴─────────────┴──────────────┘      ║
║                          │                                ║
║                          ▼                                ║
║             ┌──────────────────────────┐                  ║
║             │   API Gateway / nginx    │                  ║
║             └────────────┬─────────────┘                  ║
║                          │                                ║
║                          ▼                                ║
║             ┌──────────────────────────┐                  ║
║             │ FHIR Server (Laravel 11) │                  ║
║             │  • API REST             │                  ║
║             │  • OAuth 2.0            │                  ║
║             │  • Validación FHIR      │                  ║
║             └────────────┬─────────────┘                  ║
║                          │                                ║
║          ┌───────────────┴───────────────┐                ║
║          ▼                               ▼                ║
║  ┌──────────────┐              ┌──────────────┐          ║
║  │  PostgreSQL  │              │    Redis     │          ║
║  │  (FHIR Data) │              │   (Cache)    │          ║
║  └──────────────┘              └──────────────┘          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 5: Stack Tecnológico

```
╔═══════════════════════════════════════════════════════════╗
║  TECNOLOGÍAS SELECCIONADAS                                ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  BACKEND                                                  ║
║  ────────                                                 ║
║  • PHP 8.2+                                               ║
║  • Laravel 11 (Framework)                                 ║
║  • PostgreSQL 15+ (Base de datos)                         ║
║  • Redis 7+ (Cache & Queues)                              ║
║  • fhir/resources (Librería FHIR)                         ║
║                                                           ║
║  FRONTEND                                                 ║
║  ────────                                                 ║
║  • React 18+ (Sitio web)                                  ║
║  • Flutter 3+ (Aplicación móvil)                          ║
║  • TypeScript (Type safety)                               ║
║                                                           ║
║  SEGURIDAD                                                ║
║  ─────────                                                ║
║  • OAuth 2.0 + SMART on FHIR                              ║
║  • HTTPS/TLS 1.3                                          ║
║  • AES-256 encryption                                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Notas:**

- Justificar elección de Laravel vs otras opciones
- Explicar ventajas de PostgreSQL para JSON

---

## SLIDE 6: Recursos FHIR Utilizados

```
╔═══════════════════════════════════════════════════════════╗
║  11 RECURSOS FHIR IMPLEMENTADOS                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ENTIDADES ORGANIZACIONALES                               ║
║  ───────────────────────────                              ║
║  1. Organization    → ACME Salud y aseguradoras           ║
║  2. Location        → Clínicas (Norte, Centro, Sur)       ║
║                                                           ║
║  RECURSOS PROFESIONALES                                   ║
║  ───────────────────────                                  ║
║  3. Practitioner      → Datos del médico                  ║
║  4. PractitionerRole  → Rol y especialidad                ║
║  5. HealthcareService → Servicios especializados          ║
║                                                           ║
║  GESTIÓN DE AGENDAS                                       ║
║  ──────────────────                                       ║
║  6. Schedule          → Agenda mensual                    ║
║  7. Slot              → Espacios de tiempo                ║
║                                                           ║
║  DATOS DEL PACIENTE                                       ║
║  ──────────────────                                       ║
║  8. Patient           → Información del paciente          ║
║  9. Coverage          → Cobertura de asegurador           ║
║                                                           ║
║  GESTIÓN DE CITAS                                         ║
║  ────────────────                                         ║
║  10. Appointment        → Reserva de cita                 ║
║  11. AppointmentResponse→ Confirmación                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 7: Modelo de Relaciones

```
╔═══════════════════════════════════════════════════════════╗
║  RELACIONES ENTRE RECURSOS FHIR                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Organization ──┬─→ Location                              ║
║  (ACME Salud)   │                                         ║
║                 └─→ HealthcareService                     ║
║                           │                               ║
║  Practitioner ─→ PractitionerRole ─→ Schedule             ║
║                                            │              ║
║                    HealthcareService ─→ Schedule          ║
║                                            │              ║
║                                            ├─→ Slot       ║
║                                            │      │       ║
║  Patient ─→ Coverage ─┐                    │      │       ║
║             │         │                    │      │       ║
║             ▼         ▼                    │      │       ║
║        (Determina  (Asegurador)            │      │       ║
║         duración)                          │      │       ║
║                                            │      │       ║
║                                            ▼      ▼       ║
║                                        Appointment        ║
║                                            │              ║
║                                            ▼              ║
║                                   AppointmentResponse     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 8: Flujo de Agendamiento

```
╔═══════════════════════════════════════════════════════════╗
║  PROCESO DE AGENDAMIENTO DE CITA                          ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  1️⃣  PACIENTE BUSCA DISPONIBILIDAD                        ║
║      GET /Slot?service=Pediatría&status=free              ║
║                                                           ║
║  2️⃣  SISTEMA VALIDA COBERTURA                             ║
║      Coverage → determina duración según aseguradora      ║
║      • Salud Completa: 45-60 min                          ║
║      • Salud Cooperativa: 30-45 min                       ║
║                                                           ║
║  3️⃣  PACIENTE SELECCIONA SLOT                             ║
║      Elige fecha/hora disponible                          ║
║                                                           ║
║  4️⃣  SISTEMA CREA APPOINTMENT                             ║
║      POST /Appointment                                    ║
║      • Reserva el slot (status → busy)                    ║
║      • Asocia paciente, médico, servicio                  ║
║                                                           ║
║  5️⃣  GENERA APPOINTMENTRESPONSE                           ║
║      Confirmación con detalles completos                  ║
║                                                           ║
║  6️⃣  ENVÍA NOTIFICACIONES                                 ║
║      Email + SMS + Push notification                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 9: Ejemplo de Recurso - Appointment

```json
{
  "resourceType": "Appointment",
  "id": "appointment-001",
  "status": "booked",
  "start": "2026-05-05T08:00:00-05:00",
  "end": "2026-05-05T08:45:00-05:00",
  "minutesDuration": 45,
  "participant": [
    {
      "actor": {
        "reference": "Patient/patient-12345",
        "display": "María Fernanda Rodríguez"
      },
      "status": "accepted"
    },
    {
      "actor": {
        "reference": "Practitioner/practitioner-casas",
        "display": "Dr. Gregorio Casas - Pediatra"
      },
      "status": "accepted"
    }
  ],
  "slot": [{ "reference": "Slot/slot-20260505-0800" }]
}
```

---

## SLIDE 10: Wireframe - Portal Web

```
╔═══════════════════════════════════════════════════════════╗
║  INTERFAZ WEB - AGENDAMIENTO                              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Paso 3 de 4: Selecciona fecha y hora                    ║
║  ●────●────●────○                                         ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │        MAYO 2026                                    │ ║
║  │  Lun    Mar    Mie    Jue    Vie    Sab    Dom     │ ║
║  │  [5]    [6]    [7]    [8]    9      10     11      │ ║
║  │   ●      ●      ●      -     -      -      -       │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  HORARIOS DISPONIBLES - Lunes 5 de Mayo                  ║
║                                                           ║
║  MAÑANA                   TARDE                           ║
║  ┌──────────┐            ┌──────────┐                    ║
║  │● 8:00 AM │            │○ 2:00 PM │                    ║
║  │45 min    │            │45 min    │                    ║
║  └──────────┘            └──────────┘                    ║
║                                                           ║
║  ┌──────────┐            ┌──────────┐                    ║
║  │○ 9:00 AM │            │○ 3:15 PM │                    ║
║  │45 min    │            │45 min    │                    ║
║  └──────────┘            └──────────┘                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 11: Wireframe - App Móvil

```
╔═══════════════════════════════════════════════════════════╗
║  APLICACIÓN MÓVIL (Flutter)                               ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   ┌──────────────────────────┐                           ║
║   │ ☰  ACME Salud        🔔  │                           ║
║   ├──────────────────────────┤                           ║
║   │                          │                           ║
║   │  Hola, María 👋          │                           ║
║   │  ¿Qué necesitas hoy?     │                           ║
║   │                          │                           ║
║   │  ┌────────────────────┐  │                           ║
║   │  │ 📅 AGENDAR CITA    │  │                           ║
║   │  │ Encuentra el       │  │                           ║
║   │  │ especialista ideal │  │                           ║
║   │  └────────────────────┘  │                           ║
║   │                          │                           ║
║   │  TUS PRÓXIMAS CITAS      │                           ║
║   │  ────────────────────    │                           ║
║   │  ┌────────────────────┐  │                           ║
║   │  │ 📍 Clínica Norte   │  │                           ║
║   │  │ 👨‍⚕️ Dr. G. Casas    │  │                           ║
║   │  │ 📅 Lun 5 May       │  │                           ║
║   │  │ 🕐 8:00 AM         │  │                           ║
║   │  │    [Ver Detalles]  │  │                           ║
║   │  └────────────────────┘  │                           ║
║   │                          │                           ║
║   └──────────────────────────┘                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 12: Características del Sistema

```
╔═══════════════════════════════════════════════════════════╗
║  CARACTERÍSTICAS PRINCIPALES                              ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  🔐 SEGURIDAD                                             ║
║  • OAuth 2.0 + SMART on FHIR                              ║
║  • Roles y permisos granulares                            ║
║  • Encriptación en tránsito y reposo                      ║
║  • Auditoría completa                                     ║
║                                                           ║
║  ⚡ RENDIMIENTO                                           ║
║  • Cache Redis para datos frecuentes                      ║
║  • Índices GIN para búsquedas JSON                        ║
║  • Response time < 500ms                                  ║
║  • 1000+ req/s capacity                                   ║
║                                                           ║
║  📊 GESTIÓN INTELIGENTE                                   ║
║  • Duración automática según asegurador                   ║
║  • Prevención de doble agendamiento                       ║
║  • Liberación automática de slots cancelados              ║
║  • Reportes y analytics                                   ║
║                                                           ║
║  🔔 NOTIFICACIONES                                        ║
║  • Email confirmación                                     ║
║  • SMS recordatorio                                       ║
║  • Push notifications (app móvil)                         ║
║  • Recordatorio 24h antes                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 13: Gestión de Tiempos por Asegurador

```
╔═══════════════════════════════════════════════════════════╗
║  CONFIGURACIÓN DE TIEMPOS DE CONSULTA                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ┌───────────────────────────────────────────────────┐   ║
║  │ SALUD COOPERATIVA                                 │   ║
║  ├───────────────────────────────────────────────────┤   ║
║  │ Primera vez - Medicina General      30 min        │   ║
║  │ Primera vez - Especializada         45 min        │   ║
║  │ Control - Medicina General          20 min        │   ║
║  │ Control - Especializada             30 min        │   ║
║  │ Telemedicina - General              15 min        │   ║
║  │ Telemedicina - Especializada        20 min        │   ║
║  └───────────────────────────────────────────────────┘   ║
║                                                           ║
║  ┌───────────────────────────────────────────────────┐   ║
║  │ SALUD COMPLETA                                    │   ║
║  ├───────────────────────────────────────────────────┤   ║
║  │ Primera vez - Medicina General      45 min        │   ║
║  │ Primera vez - Especializada         60 min        │   ║
║  │ Control - Medicina General          30 min        │   ║
║  │ Control - Especializada             45 min        │   ║
║  │ Telemedicina - General              25 min        │   ║
║  │ Telemedicina - Especializada        30 min        │   ║
║  └───────────────────────────────────────────────────┘   ║
║                                                           ║
║  ℹ️ El sistema calcula automáticamente la duración       ║
║     según la cobertura del paciente                       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 14: Plan de Implementación

```
╔═══════════════════════════════════════════════════════════╗
║  CRONOGRAMA DE IMPLEMENTACIÓN - 20 SEMANAS                ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  FASE 1: Infraestructura (2 semanas)                      ║
║  └─ Setup Laravel, PostgreSQL, Redis                      ║
║                                                           ║
║  FASE 2: Recursos Base (3 semanas)                        ║
║  └─ Organization, Location, Practitioner                  ║
║                                                           ║
║  FASE 3: Sistema de Agendas (3 semanas)                   ║
║  └─ Schedule, Slot, lógica de generación                  ║
║                                                           ║
║  FASE 4: Gestión de Citas (3 semanas)                     ║
║  └─ Patient, Coverage, Appointment                        ║
║                                                           ║
║  FASE 5: Seguridad (2 semanas)                            ║
║  └─ OAuth 2.0, SMART on FHIR                              ║
║                                                           ║
║  FASE 6: Clientes (4 semanas)                             ║
║  └─ Web, Móvil, Call Center, HIS                          ║
║                                                           ║
║  FASE 7: Testing (2 semanas)                              ║
║  └─ Integración, carga, seguridad                         ║
║                                                           ║
║  FASE 8: Deployment (1 semana)                            ║
║  └─ Migración, producción, monitoring                     ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 15: Costos Estimados

```
╔═══════════════════════════════════════════════════════════╗
║  ESTIMACIÓN DE COSTOS                                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  DESARROLLO (One-time)                                    ║
║  ──────────────────────                                   ║
║  Backend Development        14 semanas    $28,000         ║
║  Frontend Development        6 semanas    $12,000         ║
║  Testing & QA                3 semanas     $6,000         ║
║  Deployment & Setup          1 semana      $2,000         ║
║                                          ─────────         ║
║                             TOTAL:        $48,000         ║
║                                                           ║
║  INFRAESTRUCTURA (Mensual)                                ║
║  ──────────────────────────                               ║
║  Application Server (4vCPU, 8GB)            $80           ║
║  PostgreSQL Database (100GB SSD)           $100           ║
║  Redis Cache (2GB)                          $30           ║
║  Load Balancer                              $20           ║
║  Backups (500GB)                            $25           ║
║  SSL Certificate (Let's Encrypt)             $0           ║
║                                          ─────────         ║
║                           TOTAL/MES:       $255           ║
║                           TOTAL/AÑO:     $3,060           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 16: Métricas de Éxito

```
╔═══════════════════════════════════════════════════════════╗
║  INDICADORES CLAVE DE DESEMPEÑO (KPIs)                    ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  DISPONIBILIDAD                                           ║
║  • Uptime: 99.9% (objetivo)                               ║
║  • Max downtime: 8.76 horas/año                           ║
║                                                           ║
║  RENDIMIENTO                                              ║
║  • Response time promedio: < 500ms                        ║
║  • Tasa de error: < 0.1%                                  ║
║  • Capacidad: 1000+ req/s                                 ║
║                                                           ║
║  NEGOCIO                                                  ║
║  • Citas agendadas/día: 200+                              ║
║  • Tasa de cancelación: < 10%                             ║
║  • Tasa de no-show: < 15%                                 ║
║  • Satisfacción usuario: > 4.5/5                          ║
║                                                           ║
║  OPERACIONAL                                              ║
║  • Tiempo promedio de agendamiento: < 3 min               ║
║  • Usuarios concurrentes soportados: 1000+                ║
║  • Cobertura de código: > 80%                             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 17: Beneficios Esperados

```
╔═══════════════════════════════════════════════════════════╗
║  BENEFICIOS DEL SISTEMA                                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  PARA LA ORGANIZACIÓN                                     ║
║  ────────────────────                                     ║
║  ✅ Unificación de 3 puntos de atención                   ║
║  ✅ Reducción de errores de agendamiento                  ║
║  ✅ Optimización de recursos médicos                      ║
║  ✅ Métricas y reportes centralizados                     ║
║  ✅ Cumplimiento regulatorio (FHIR)                       ║
║                                                           ║
║  PARA LOS PACIENTES                                       ║
║  ──────────────────                                       ║
║  ✅ Agendamiento 24/7 desde cualquier canal               ║
║  ✅ Visibilidad de disponibilidad en tiempo real          ║
║  ✅ Confirmación instantánea                              ║
║  ✅ Recordatorios automáticos                             ║
║  ✅ Gestión de citas simplificada                         ║
║                                                           ║
║  PARA EL PERSONAL MÉDICO                                  ║
║  ──────────────────────                                   ║
║  ✅ Agendas organizadas y optimizadas                     ║
║  ✅ Información del paciente disponible                   ║
║  ✅ Reducción de ausencias                                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 18: Seguridad y Cumplimiento

```
╔═══════════════════════════════════════════════════════════╗
║  SEGURIDAD Y PRIVACIDAD                                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  AUTENTICACIÓN Y AUTORIZACIÓN                             ║
║  ─────────────────────────────                            ║
║  • OAuth 2.0 estándar de la industria                     ║
║  • SMART on FHIR para scopes granulares                   ║
║  • Multi-factor authentication (MFA)                      ║
║  • Session management seguro                              ║
║                                                           ║
║  PROTECCIÓN DE DATOS                                      ║
║  ────────────────────                                     ║
║  • HTTPS/TLS 1.3 en tránsito                              ║
║  • AES-256 encryption en reposo                           ║
║  • Tokenización de datos sensibles                        ║
║  • Backups encriptados                                    ║
║                                                           ║
║  AUDITORÍA Y TRAZABILIDAD                                 ║
║  ─────────────────────────                                ║
║  • Logs de todas las operaciones                          ║
║  • Registro de accesos                                    ║
║  • Versionado de recursos FHIR                            ║
║  • Retención de logs: 7 años                              ║
║                                                           ║
║  CUMPLIMIENTO                                             ║
║  ────────────                                             ║
║  • FHIR R4 specification                                  ║
║  • Normativa colombiana de salud                          ║
║  • HABEAS DATA - Ley 1581 de 2012                         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 19: Próximos Pasos

```
╔═══════════════════════════════════════════════════════════╗
║  ROADMAP Y PRÓXIMOS PASOS                                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  CORTO PLAZO (1-3 meses)                                  ║
║  ────────────────────────                                 ║
║  1. Aprobación del proyecto                               ║
║  2. Conformación del equipo de desarrollo                 ║
║  3. Setup de infraestructura                              ║
║  4. Implementación de MVP                                 ║
║     (Recursos base + agendamiento simple)                 ║
║                                                           ║
║  MEDIANO PLAZO (4-6 meses)                                ║
║  ──────────────────────────                               ║
║  5. Implementación completa backend                       ║
║  6. Desarrollo de clientes (web + móvil)                  ║
║  7. Integración con sistemas existentes                   ║
║  8. Testing exhaustivo                                    ║
║                                                           ║
║  LARGO PLAZO (6+ meses)                                   ║
║  ───────────────────────                                  ║
║  9. Deployment en producción                              ║
║  10. Capacitación de usuarios                             ║
║  11. Monitoreo y optimización                             ║
║  12. Expansión a nuevas funcionalidades                   ║
║     (Telemedicina, historia clínica, etc.)                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 20: Conclusiones

```
╔═══════════════════════════════════════════════════════════╗
║  CONCLUSIONES                                             ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  ✅ SOLUCIÓN TÉCNICAMENTE VIABLE                          ║
║     Basada en estándares internacionales (FHIR)           ║
║                                                           ║
║  ✅ ARQUITECTURA ESCALABLE                                ║
║     Preparada para crecimiento futuro                     ║
║                                                           ║
║  ✅ INVERSIÓN JUSTIFICADA                                 ║
║     ROI positivo a 12-18 meses                            ║
║                                                           ║
║  ✅ INTEROPERABILIDAD GARANTIZADA                         ║
║     Compatible con futuros sistemas                       ║
║                                                           ║
║  ✅ MEJORA DE EXPERIENCIA                                 ║
║     Para pacientes, médicos y administrativos             ║
║                                                           ║
║  ───────────────────────────────────────────              ║
║                                                           ║
║  El sistema de Agenda FHIR representa una solución        ║
║  moderna, robusta y escalable que unifica el              ║
║  agendamiento en ACME Salud, mejorando la                 ║
║  eficiencia operacional y la satisfacción del             ║
║  usuario.                                                 ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 21: Referencias Bibliográficas

```
╔═══════════════════════════════════════════════════════════╗
║  FUENTES BIBLIOGRÁFICAS                                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  FHIR Y ESTÁNDARES                                        ║
║  ──────────────────                                       ║
║  [1] HL7 International. "FHIR R4 Specification"           ║
║      https://www.hl7.org/fhir/R4/                         ║
║                                                           ║
║  [2] HL7 FHIR. "Appointment Resource"                     ║
║      https://www.hl7.org/fhir/appointment.html            ║
║                                                           ║
║  [3] SMART Health IT. "SMART on FHIR"                     ║
║      https://docs.smarthealthit.org/                      ║
║                                                           ║
║  FRAMEWORKS Y TECNOLOGÍAS                                 ║
║  ─────────────────────────                                ║
║  [4] Laravel. "Laravel 11.x Documentation"                ║
║      https://laravel.com/docs/11.x                        ║
║                                                           ║
║  [5] PostgreSQL. "JSON Functions and Operators"           ║
║      https://www.postgresql.org/docs/current/             ║
║                                                           ║
║  [6] React. "React Documentation"                         ║
║      https://react.dev/                                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## SLIDE 22: Preguntas y Respuestas

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                                                           ║
║                                                           ║
║                    ¿PREGUNTAS?                            ║
║                                                           ║
║                                                           ║
║              Sistema de Agenda FHIR                       ║
║                   ACME Salud                              ║
║                                                           ║
║                                                           ║
║              Gracias por su atención                      ║
║                                                           ║
║                                                           ║
║          📧 desarrollo@acmesalud.com                      ║
║          🌐 www.acmesalud.com                             ║
║                                                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Materiales de Apoyo para la Presentación

### Documentos Incluidos

1. **ARQUITECTURA.md** - Documento técnico completo
2. **README.md** - Guía del proyecto
3. **INSTALACION.md** - Instrucciones de instalación
4. **WIREFRAMES.md** - Diseños de interfaz
5. **docs/ejemplos-fhir/** - Ejemplos de recursos FHIR
6. **REFERENCIAS.md** - Bibliografía completa

### Demo en Vivo (Opcional)

Si hay tiempo, preparar:

- Postman collection con ejemplos de API calls
- Ambiente de desarrollo mostrando estructura Laravel
- Mockups interactivos (Figma/Adobe XD)

### Apéndice: Preguntas Frecuentes

**P: ¿Qué pasa si un paciente cancela?**
R: El Appointment status cambia a "cancelled", el Slot se libera automáticamente, y se notifica a todas las partes.

**P: ¿Cómo se evita el doble agendamiento?**
R: Los Slots tienen un estado (free/busy). Al crear un Appointment, el Slot se bloquea atómicamente en la base de datos.

**P: ¿Es compatible con otros sistemas?**
R: Sí, al usar FHIR R4, es compatible con cualquier sistema que implemente el mismo estándar.

**P: ¿Qué pasa si cambia la normativa?**
R: FHIR es un estándar vivo. Al usarlo, las actualizaciones son más sencillas que con sistemas propietarios.

---

**Fin de la Presentación**

**Tiempo estimado:** 30 minutos  
**Formato sugerido:** PowerPoint / Google Slides con estas slides  
**Incluir:** Demos visuales, código de ejemplo, wireframes
