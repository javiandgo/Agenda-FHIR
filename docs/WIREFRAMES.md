# Wireframes y Mockups - Sistema de Agenda FHIR

Este documento presenta los diseños de interfaz de usuario para los diferentes canales de atención del sistema de agendas de ACME Salud.

## 1. Sitio Web - Portal del Paciente

### 1.1 Página de Inicio

```
╔════════════════════════════════════════════════════════════════╗
║ [Logo ACME]                     [Inicio][Servicios][Contacto] ║
║                                             [Iniciar Sesión] ⚙ ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║         SISTEMA DE AGENDAS EN LÍNEA                           ║
║         Agenda tu cita médica fácil y rápido                  ║
║                                                                ║
║         [  Agendar Nueva Cita  ]                              ║
║         [  Mis Citas           ]                              ║
║                                                                ║
║  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          ║
║  │  👨‍⚕️          │  │  📅          │  │  🏥          │          ║
║  │  Especialistas│  │  Horarios   │  │  Ubicaciones│          ║
║  │  Disponibles  │  │  Flexibles  │  │  Cercanas   │          ║
║  └─────────────┘  └─────────────┘  └─────────────┘          ║
║                                                                ║
║  ┌───────────────────────────────────────────────────────┐   ║
║  │ NUESTRAS CLÍNICAS                                     │   ║
║  ├───────────────────────────────────────────────────────┤   ║
║  │ 📍 Norte    📍 Centro    📍 Sur                       │   ║
║  └───────────────────────────────────────────────────────┘   ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 1.2 Flujo de Agendamiento

#### Paso 1: Selección de Especialidad

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud                                    [Usuario] [Salir] ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Agendar Nueva Cita                                           ║
║  ─────────────────────────────────────────────────────────────║
║                                                                ║
║  Paso 1 de 4: Selecciona la especialidad                     ║
║  ●────○────○────○                                             ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────┐    ║
║  │ 🔍 Buscar especialidad...                            │    ║
║  └──────────────────────────────────────────────────────┘    ║
║                                                                ║
║  ┌────────────────────┐  ┌────────────────────┐             ║
║  │ 👶 PEDIATRÍA       │  │ 🤰 OBSTETRICIA     │             ║
║  │ 15 turnos disp.    │  │ 8 turnos disp.     │             ║
║  │ [Seleccionar]      │  │ [Seleccionar]      │             ║
║  └────────────────────┘  └────────────────────┘             ║
║                                                                ║
║  ┌────────────────────┐  ┌────────────────────┐             ║
║  │ 🫁 CARDIOLOGÍA     │  │ 🦴 NEFROLOGÍA      │             ║
║  │ 12 turnos disp.    │  │ 6 turnos disp.     │             ║
║  │ [Seleccionar]      │  │ [Seleccionar]      │             ║
║  └────────────────────┘  └────────────────────┘             ║
║                                                                ║
║  ┌────────────────────┐  ┌────────────────────┐             ║
║  │ 💊 ONCOLOGÍA       │  │ 🍽️ GASTROENTER.    │             ║
║  │ 4 turnos disp.     │  │ 10 turnos disp.    │             ║
║  │ [Seleccionar]      │  │ [Seleccionar]      │             ║
║  └────────────────────┘  └────────────────────┘             ║
║                                                                ║
║                               [Cancelar]  [Siguiente →]       ║
╚════════════════════════════════════════════════════════════════╝
```

#### Paso 2: Selección de Médico y Ubicación

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud - Agendar Cita                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Paso 2 de 4: Selecciona médico y ubicación                  ║
║  ●────●────○────○                                             ║
║                                                                ║
║  Especialidad seleccionada: PEDIATRÍA                         ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────┐    ║
║  │ UBICACIÓN                                            │    ║
║  │ ○ Todas las clínicas                                 │    ║
║  │ ● Clínica Norte    ○ Clínica Centro    ○ Clínica Sur│    ║
║  └──────────────────────────────────────────────────────┘    ║
║                                                                ║
║  MÉDICOS DISPONIBLES                                          ║
║  ──────────────────────────────────────────────────────────  ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ ┌──┐                                                   │  ║
║  │ │👨‍⚕️│  Dr. Gregorio Casas                              │  ║
║  │ └──┘  Pediatra                                         │  ║
║  │       📋 T.P. 111222333                                │  ║
║  │       📍 Clínica Norte                                 │  ║
║  │       ⭐ 4.8/5.0 (245 opiniones)                       │  ║
║  │       📅 Próxima disponibilidad: Lun 5 May - 8:00 AM  │  ║
║  │                                    [● Seleccionar]     │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║  ┌────────────────────────────────────────────────────────┐  ║
║  │ ┌──┐                                                   │  ║
║  │ │👨‍⚕️│  Dra. Ana María López                            │  ║
║  │ └──┘  Pediatra                                         │  ║
║  │       📋 T.P. 999888777                                │  ║
║  │       📍 Clínica Norte                                 │  ║
║  │       ⭐ 4.9/5.0 (189 opiniones)                       │  ║
║  │       📅 Próxima disponibilidad: Mar 6 May - 9:00 AM  │  ║
║  │                                    [○ Seleccionar]     │  ║
║  └────────────────────────────────────────────────────────┘  ║
║                                                                ║
║                          [← Anterior]  [Siguiente →]          ║
╚════════════════════════════════════════════════════════════════╝
```

#### Paso 3: Selección de Fecha y Hora

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud - Agendar Cita                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Paso 3 de 4: Selecciona fecha y hora                        ║
║  ●────●────●────○                                             ║
║                                                                ║
║  Especialidad: PEDIATRÍA                                      ║
║  Médico: Dr. Gregorio Casas                                   ║
║  Ubicación: Clínica Norte                                     ║
║  Tu cobertura: Salud Completa - Duración: 45 min             ║
║                                                                ║
║  ┌─────────────────────────────────────────────────────────┐ ║
║  │        MAYO 2026          [<] [Semana] [Mes] [>]        │ ║
║  ├─────────────────────────────────────────────────────────┤ ║
║  │  Lun    Mar    Mie    Jue    Vie    Sab    Dom         │ ║
║  │         1      2      3      4      5      6            │ ║
║  │  [5]    [6]    [7]    [8]    9      10     11           │ ║
║  │   ●      ●      ●      -     -      -      -            │ ║
║  │  12     13     14     15     16     17     18           │ ║
║  │   ●      ●      -      ●      ●      -      -           │ ║
║  └─────────────────────────────────────────────────────────┘ ║
║                                                                ║
║  HORARIOS DISPONIBLES - Lunes 5 de Mayo                      ║
║  ──────────────────────────────────────────────────────────  ║
║                                                                ║
║  MAÑANA                          TARDE                        ║
║  ┌──────────┐  ┌──────────┐    ┌──────────┐  ┌──────────┐  ║
║  │● 8:00 AM │  │○ 9:00 AM │    │○ 2:00 PM │  │○ 3:15 PM │  ║
║  │45 min    │  │45 min    │    │45 min    │  │45 min    │  ║
║  └──────────┘  └──────────┘    └──────────┘  └──────────┘  ║
║                                                                ║
║  ┌──────────┐  ┌──────────┐    ┌──────────┐                 ║
║  │○ 10:15AM │  │○ 11:30AM │    │○ 4:30 PM │                 ║
║  │45 min    │  │45 min    │    │45 min    │                 ║
║  └──────────┘  └──────────┘    └──────────┘                 ║
║                                                                ║
║  ℹ️ Los horarios se muestran según tu aseguradora            ║
║                                                                ║
║                          [← Anterior]  [Siguiente →]          ║
╚════════════════════════════════════════════════════════════════╝
```

#### Paso 4: Confirmación

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud - Confirmar Cita                                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Paso 4 de 4: Confirma tu cita                                ║
║  ●────●────●────●                                             ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │ RESUMEN DE TU CITA                                       │║
║  ├──────────────────────────────────────────────────────────┤║
║  │                                                           │║
║  │ 📅 Fecha:        Lunes, 5 de Mayo de 2026               │║
║  │ 🕐 Hora:         8:00 AM - 8:45 AM (45 minutos)          │║
║  │ 👨‍⚕️ Médico:       Dr. Gregorio Casas                      │║
║  │ 🏥 Especialidad:  Pediatría                              │║
║  │ 📍 Ubicación:    Clínica Norte                           │║
║  │                  Carrera 7 #100-50                       │║
║  │                  [Ver mapa]                              │║
║  │ 💳 Cobertura:    Salud Completa                          │║
║  │                                                           │║
║  │ ℹ️ INFORMACIÓN IMPORTANTE                                │║
║  │ • Llegar 15 minutos antes de la cita                    │║
║  │ • Traer documento de identidad                          │║
║  │ • Traer carné de vacunas (pediatría)                    │║
║  │ • Si necesitas cancelar, hazlo con 24h de anticipación  │║
║  │                                                           │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │ 📝 Motivo de consulta (opcional)                         │║
║  │ ┌────────────────────────────────────────────────────┐  │║
║  │ │ Valoración pediátrica general                      │  │║
║  │ │                                                     │  │║
║  │ └────────────────────────────────────────────────────┘  │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  □ Acepto términos y condiciones                              ║
║  □ Autorizo tratamiento de datos personales                   ║
║  □ Deseo recibir recordatorios por email/SMS                  ║
║                                                                ║
║                   [← Anterior]  [✓ CONFIRMAR CITA]            ║
╚════════════════════════════════════════════════════════════════╝
```

#### Paso 5: Confirmación Exitosa

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud                                                     ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║                          ✓                                     ║
║                    CITA CONFIRMADA                             ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │                                                           │║
║  │ Tu cita ha sido agendada exitosamente                    │║
║  │                                                           │║
║  │ Número de cita: APT-2026-001234                          │║
║  │                                                           │║
║  │ 📅 Lunes, 5 de Mayo de 2026                              │║
║  │ 🕐 8:00 AM - 8:45 AM                                     │║
║  │ 👨‍⚕️ Dr. Gregorio Casas - Pediatría                        │║
║  │ 📍 Clínica Norte                                          │║
║  │                                                           │║
║  │ ✉️  Hemos enviado la confirmación a:                     │║
║  │    maria.rodriguez@email.com                             │║
║  │    +57 300 1234567                                       │║
║  │                                                           │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  PRÓXIMOS PASOS:                                              ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │ 1. Revisa el correo de confirmación                      │║
║  │ 2. Añade la cita a tu calendario                         │║
║  │ 3. Prepara la documentación requerida                    │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  [📄 Descargar Comprobante]  [📅 Añadir a Calendario]         ║
║  [🏠 Volver al Inicio]       [📋 Ver Mis Citas]               ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

### 1.3 Panel de Mis Citas

```
╔════════════════════════════════════════════════════════════════╗
║ ACME Salud - Mis Citas                       [María R.] [⚙️]   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  [+ Nueva Cita]    [🔍 Buscar...]    [Filtros ▼]              ║
║                                                                ║
║  ┌─────────┬─────────┬─────────┐                             ║
║  │ Próximas│ Pasadas │Canceladas│                            ║
║  └─────────┴─────────┴─────────┘                             ║
║                                                                ║
║  PRÓXIMAS CITAS                                               ║
║  ──────────────────────────────────────────────────────────  ║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │ 📅 Lunes, 5 de Mayo 2026 - 8:00 AM                       │║
║  │ ─────────────────────────────────────────                │║
║  │ 👨‍⚕️ Dr. Gregorio Casas                                     │║
║  │ 🏥 Pediatría - Primera vez                               │║
║  │ 📍 Clínica Norte, Consultorio 204                        │║
║  │ ⏱️  Duración: 45 minutos                                  │║
║  │ 💳 Salud Completa                                         │║
║  │                                                           │║
║  │ [📄 Ver Detalles] [📅 Calendario] [❌ Cancelar]           │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  ┌──────────────────────────────────────────────────────────┐║
║  │ 📅 Viernes, 15 de Mayo 2026 - 2:00 PM                    │║
║  │ ─────────────────────────────────────────                │║
║  │ 👩‍⚕️ Dra. Laura Martínez                                   │║
║  │ 🏥 Medicina General - Control                            │║
║  │ 📍 Clínica Centro, Consultorio 105                       │║
║  │ ⏱️  Duración: 30 minutos                                  │║
║  │ 💳 Salud Completa                                         │║
║  │                                                           │║
║  │ [📄 Ver Detalles] [📅 Calendario] [❌ Cancelar]           │║
║  └──────────────────────────────────────────────────────────┘║
║                                                                ║
║  No hay más citas próximas                                    ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
```

---

## 2. Aplicación Móvil

### 2.1 Pantalla Principal (Home)

```
┌──────────────────────────┐
│ ☰  ACME Salud        🔔  │
├──────────────────────────┤
│                          │
│  Hola, María 👋          │
│  ¿Qué necesitas hoy?     │
│                          │
│  ┌────────────────────┐  │
│  │ 📅 AGENDAR CITA    │  │
│  │ Encuentra el       │  │
│  │ especialista ideal │  │
│  └────────────────────┘  │
│                          │
│  TUS PRÓXIMAS CITAS      │
│  ────────────────────    │
│                          │
│  ┌────────────────────┐  │
│  │ 📍 Clínica Norte   │  │
│  │ 👨‍⚕️ Dr. G. Casas    │  │
│  │ 📅 Lun 5 May       │  │
│  │ 🕐 8:00 AM         │  │
│  │    [Ver Detalles]  │  │
│  └────────────────────┘  │
│                          │
│  ACCESOS RÁPIDOS         │
│  ────────────────────    │
│                          │
│  📋 Mis Citas            │
│  🏥 Clínicas             │
│  👨‍⚕️ Especialistas        │
│  📞 Contacto             │
│                          │
└──────────────────────────┘
```

### 2.2 Flujo de Agendamiento Móvil

```
┌──────────────────────────┐    ┌──────────────────────────┐
│ ← Especialidades         │    │ ← Médicos                │
├──────────────────────────┤    ├──────────────────────────┤
│                          │    │                          │
│ 🔍 Buscar...             │    │ Pediatría                │
│                          │    │                          │
│ ┌──────────────────────┐ │    │ ┌──────────────────────┐ │
│ │ 👶 Pediatría         │ │    │ │ ┌──┐ Dr. G. Casas   │ │
│ │ 15 turnos disponibles│ │    │ │ │👨‍⚕️│ Pediatra       │ │
│ │         [→]          │ │    │ │ └──┘ ⭐ 4.8/5       │ │
│ └──────────────────────┘ │    │ │ 📍 Clínica Norte   │ │
│                          │    │ │     [Seleccionar]  │ │
│ ┌──────────────────────┐ │    │ └──────────────────────┘ │
│ │ 🤰 Obstetricia       │ │    │                          │
│ │ 8 turnos disponibles │ │    │ ┌──────────────────────┐ │
│ │         [→]          │ │    │ │ ┌──┐ Dra. A. López  │ │
│ └──────────────────────┘ │    │ │ │👩‍⚕️│ Pediatra       │ │
│                          │    │ │ └──┘ ⭐ 4.9/5       │ │
│ ┌──────────────────────┐ │    │ │ 📍 Clínica Norte   │ │
│ │ 🫁 Cardiología       │ │    │ │     [Seleccionar]  │ │
│ │ 12 turnos disponibles│ │    │ └──────────────────────┘ │
│ │         [→]          │ │    │                          │
│ └──────────────────────┘ │    └──────────────────────────┘
│                          │
└──────────────────────────┘
```

---

## 3. Sistema Call Center

### 3.1 Panel de Agendamiento

```
╔════════════════════════════════════════════════════════════════════════╗
║ ACME Salud - Sistema Call Center                    [Agente: Ana María]║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║ ┌────────────────────────────────┐ ┌──────────────────────────────┐  ║
║ │ INFORMACIÓN DEL PACIENTE       │ │ BÚSQUEDA DE DISPONIBILIDAD   │  ║
║ ├────────────────────────────────┤ ├──────────────────────────────┤  ║
║ │ 🔍 Buscar: CC/Teléfono         │ │ Especialidad: [Pediatría ▼]  │  ║
║ │ ┌──────────────────────────┐   │ │ Ubicación: [Todas      ▼]    │  ║
║ │ │ 1234567890               │   │ │ Médico: [Cualquiera   ▼]     │  ║
║ │ └──────────────────────────┘   │ │ Fecha desde: [05/05/2026]    │  ║
║ │                                │ │ [  Buscar Disponibilidad  ]   │  ║
║ │ Nombre: María F. Rodríguez     │ └──────────────────────────────┘  ║
║ │ CC: 1234567890                 │                                   ║
║ │ Tel: +57 300 1234567           │ HORARIOS DISPONIBLES              ║
║ │ Email: maria.r@email.com       │ ─────────────────────────        ║
║ │ Aseguradora: Salud Completa    │                                   ║
║ │ Plan: Oro                      │ ┌──────────────────────────────┐ ║
║ │                                │ │ ✓ Lun 5 May - 8:00 AM        │ ║
║ │ HISTORIAL DE CITAS             │ │   Dr. Gregorio Casas         │ ║
║ │ ─────────────────              │ │   45 min - Salud Completa    │ ║
║ │ • 15 Mar 2026 - Pediatría      │ │   [Agendar]                  │ ║
║ │ • 20 Ene 2026 - M. General     │ └──────────────────────────────┘ ║
║ └────────────────────────────────┘                                   ║
║                                    ┌──────────────────────────────┐ ║
║ CITA EN PROCESO                    │ ○ Lun 5 May - 9:00 AM        │ ║
║ ─────────────────                  │   Dr. Gregorio Casas         │ ║
║                                    │   45 min - Salud Completa    │ ║
║ [✓] Especialidad: Pediatría        │   [Agendar]                  │ ║
║ [✓] Médico: Dr. Casas              └──────────────────────────────┘ ║
║ [✓] Fecha/Hora: 5 May 8:00 AM      ┌──────────────────────────────┐ ║
║ [ ] Confirmada                     │ ○ Mar 6 May - 8:00 AM        │ ║
║                                    │   Dra. Ana López             │ ║
║ Motivo: _____________________      │   45 min - Salud Completa    │ ║
║                                    │   [Agendar]                  │ ║
║ [📞 En llamada] ⏱️ 03:25           └──────────────────────────────┘ ║
║                                                                        ║
║ [Guardar]  [Cancelar]  [Enviar SMS]  [Enviar Email]                  ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 4. Módulo HIS (Ventanilla)

### 4.1 Interfaz de Agendamiento en Ventanilla

```
╔════════════════════════════════════════════════════════════════════════╗
║ HIS ACME Salud - Módulo Agendas            Clínica Norte - Ventanilla 1║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║ ┌──────────────────────────────────────────────────────────────────┐  ║
║ │ PACIENTE                                                         │  ║
║ │ CC: [____________]  [Buscar]  [Nuevo Paciente]                   │  ║
║ │                                                                  │  ║
║ │ Nombre: María Fernanda Rodríguez                                 │  ║
║ │ Documento: 1234567890                                            │  ║
║ │ Teléfono: +57 300 1234567                                        │  ║
║ │ Aseguradora: Salud Completa - Plan Oro                           │  ║
║ └──────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║ ┌─────────────────────────┐  ┌─────────────────────────────────────┐ ║
║ │ SELECCIÓN DE SERVICIO   │  │ CALENDARIO Y HORARIOS               │ ║
║ ├─────────────────────────┤  ├─────────────────────────────────────┤ ║
║ │ Especialidad:           │  │        MAYO 2026                    │ ║
║ │ [Pediatría         ▼]   │  │  L  M  M  J  V  S  D               │ ║
║ │                         │  │              1  2  3                │ ║
║ │ Tipo de consulta:       │  │  4  5  6  7  8  9 10               │ ║
║ │ ● Primera vez           │  │ 11 12 13 14 15 16 17               │ ║
║ │ ○ Control               │  │ 18 19 20 21 22 23 24               │ ║
║ │ ○ Telemedicina          │  │ 25 26 27 28 29 30 31               │ ║
║ │                         │  │                                     │ ║
║ │ Médico:                 │  │ Día seleccionado: Lun 5 Mayo        │ ║
║ │ [Dr. G. Casas      ▼]   │  │                                     │ ║
║ │                         │  │ HORARIOS DISPONIBLES:               │ ║
║ │ Sede:                   │  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │ ║
║ │ [Clínica Norte     ▼]   │  │ │8:00 │ │9:00 │ │10:15│ │11:30│  │ ║
║ │                         │  │ └─────┘ └─────┘ └─────┘ └─────┘  │ ║
║ │ Duración: 45 min        │  │ ┌─────┐ ┌─────┐ ┌─────┐           │ ║
║ │ (según aseguradora)     │  │ │14:00│ │15:15│ │16:30│           │ ║
║ └─────────────────────────┘  │ └─────┘ └─────┘ └─────┘           │ ║
║                              └─────────────────────────────────────┘ ║
║                                                                        ║
║ ┌──────────────────────────────────────────────────────────────────┐  ║
║ │ RESUMEN DE CITA                                                  │  ║
║ │ Fecha: Lunes, 5 de Mayo de 2026       Hora: 8:00 AM - 8:45 AM   │  ║
║ │ Médico: Dr. Gregorio Casas            Consultorio: Por asignar   │  ║
║ │ Motivo: ________________________________________________________  │  ║
║ └──────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║ [Limpiar]  [Confirmar Cita]  [Imprimir Comprobante]                   ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 5. Panel Administrativo (Gestión de Agendas)

### 5.1 Creación de Agenda Mensual

```
╔════════════════════════════════════════════════════════════════════════╗
║ ACME Salud - Administración de Agendas                   [Admin: Juan] ║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║ [Dashboard] [Agendas] [Médicos] [Horarios] [Reportes] [Configuración] ║
║                                                                        ║
║ CREAR NUEVA AGENDA                                                     ║
║ ──────────────────────────────────────────────────────────────────    ║
║                                                                        ║
║ ┌──────────────────────────────────────────────────────────────────┐  ║
║ │ INFORMACIÓN BÁSICA                                               │  ║
║ ├──────────────────────────────────────────────────────────────────┤  ║
║ │ Período: [Mayo         ▼]  Año: [2026         ▼]                │  ║
║ │                                                                  │  ║
║ │ Tipo de agenda:                                                  │  ║
║ │ ● Por Médico   ○ Por Servicio                                    │  ║
║ │                                                                  │  ║
║ │ Médico: [Dr. Gregorio Casas - Pediatría       ▼]                │  ║
║ │ Sede: [Clínica Norte                           ▼]                │  ║
║ │ Consultorio: [204                              ▼]                │  ║
║ └──────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║ ┌──────────────────────────────────────────────────────────────────┐  ║
║ │ CONFIGURACIÓN DE HORARIOS                                        │  ║
║ ├──────────────────────────────────────────────────────────────────┤  ║
║ │ Días de atención:                                                │  ║
║ │ [✓] Lunes    [✓] Martes    [✓] Miércoles    [✓] Jueves          │  ║
║ │ [✓] Viernes  [ ] Sábado    [ ] Domingo                           │  ║
║ │                                                                  │  ║
║ │ Horario de atención:                                             │  ║
║ │ Mañana: [08:00] a [12:00]                                        │  ║
║ │ Tarde:  [14:00] a [18:00]                                        │  ║
║ │                                                                  │  ║
║ │ Duración de slots (según aseguradora):                           │  ║
║ │ Salud Cooperativa - Primera vez: 45 min | Control: 30 min       │  ║
║ │ Salud Completa - Primera vez: 60 min | Control: 45 min          │  ║
║ │                                                                  │  ║
║ │ Excepciones (días no laborables):                                │  ║
║ │ [+ Agregar día festivo]                                          │  ║
║ └──────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║ ┌──────────────────────────────────────────────────────────────────┐  ║
║ │ RESUMEN DE AGENDA                                                │  ║
║ │ Total slots a generar: 180                                       │  ║
║ │ Días laborables: 20                                              │  ║
║ │ Horas/día: 8                                                     │  ║
║ └──────────────────────────────────────────────────────────────────┘  ║
║                                                                        ║
║ [Cancelar]  [Vista Previa]  [Guardar Borrador]  [Publicar Agenda]    ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 6. Notificaciones y Recordatorios

### 6.1 Email de Confirmación

```
De: noreply@acmesalud.com
Para: maria.rodriguez@email.com
Asunto: Confirmación de Cita - ACME Salud

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  [LOGO ACME SALUD]                                        ║
║                                                           ║
║  CONFIRMACIÓN DE CITA MÉDICA                              ║
║  ═════════════════════════                                ║
║                                                           ║
║  Hola María,                                              ║
║                                                           ║
║  Tu cita ha sido agendada exitosamente.                   ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │ DETALLES DE TU CITA                                 │ ║
║  │─────────────────────────────────────────────────────│ ║
║  │                                                     │ ║
║  │ Número de cita: APT-2026-001234                     │ ║
║  │                                                     │ ║
║  │ 📅 Fecha:       Lunes, 5 de Mayo de 2026           │ ║
║  │ 🕐 Hora:        8:00 AM - 8:45 AM                   │ ║
║  │ 👨‍⚕️ Médico:      Dr. Gregorio Casas                  │ ║
║  │ 🏥 Especialidad:Pediatría                           │ ║
║  │ 📍 Ubicación:   Clínica Norte                       │ ║
║  │                 Carrera 7 #100-50                   │ ║
║  │                 Consultorio 204                     │ ║
║  │                                                     │ ║
║  │ [Ver en Mapa]  [Añadir a Calendario]               │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  RECOMENDACIONES:                                         ║
║  • Llegar 15 minutos antes de la cita                    ║
║  • Traer documento de identidad                          ║
║  • Traer carné de vacunas del menor                      ║
║  • Traer exámenes previos si los tiene                   ║
║                                                           ║
║  ¿Necesitas cancelar o reprogramar?                       ║
║  [Gestionar Cita]                                         ║
║                                                           ║
║  Atentamente,                                             ║
║  Equipo ACME Salud                                        ║
║                                                           ║
║  ────────────────────────────────────────────────         ║
║  📞 +57 1 234 5678  |  📧 info@acmesalud.com             ║
║  🌐 www.acmesalud.com                                     ║
╚═══════════════════════════════════════════════════════════╝
```

### 6.2 SMS Recordatorio

```
┌──────────────────────────────────────┐
│ ACME Salud                           │
│                                      │
│ Recordatorio: Tienes cita mañana     │
│ 5 May a las 8:00 AM con              │
│ Dr. Gregorio Casas en Clínica Norte. │
│                                      │
│ Consultorio 204.                     │
│ Llega 15 min antes.                  │
│                                      │
│ Cita: APT-2026-001234                │
│                                      │
│ Para cancelar:                       │
│ https://acme.co/c/APT001234          │
└──────────────────────────────────────┘
```

### 6.3 Notificación Push (App Móvil)

```
┌──────────────────────────────────────┐
│ [🏥] ACME Salud          Ahora        │
├──────────────────────────────────────┤
│ Recordatorio de Cita                 │
│                                      │
│ Mañana a las 8:00 AM                 │
│ Dr. Gregorio Casas - Pediatría       │
│ Clínica Norte, Consultorio 204       │
│                                      │
│ [Ver detalles] [Añadir a calendario] │
└──────────────────────────────────────┘
```

---

## 7. Resumen de Características UI/UX

### Principios de Diseño

1. **Accesibilidad**
   - Contraste WCAG AA mínimo
   - Tamaños de fuente ajustables
   - Navegación por teclado
   - Lectores de pantalla compatibles

2. **Responsividad**
   - Mobile-first design
   - Breakpoints: 320px, 768px, 1024px, 1440px
   - Touch targets mínimo 44x44px

3. **Consistencia**
   - Sistema de diseño unificado
   - Componentes reutilizables
   - Paleta de colores corporativa

4. **Feedback Visual**
   - Estados de carga
   - Confirmaciones de acciones
   - Mensajes de error claros
   - Indicadores de progreso

### Paleta de Colores Sugerida

```
Primary:   #0066CC (Azul ACME)
Secondary: #00A859 (Verde success)
Warning:   #FF9900 (Naranja)
Error:     #CC0000 (Rojo)
Gray-100:  #F5F5F5
Gray-500:  #9E9E9E
Gray-900:  #212121
White:     #FFFFFF
```

### Tipografía

```
Headings:  Inter Bold / 24-32px
Body:      Inter Regular / 14-16px
Small:     Inter Regular / 12px
```

---

## Conclusión

Los wireframes presentados cubren los principales flujos de usuario para el sistema de agendas FHIR de ACME Salud:

- ✅ Portal web para pacientes
- ✅ Aplicación móvil
- ✅ Sistema call center
- ✅ Módulo HIS (ventanilla)
- ✅ Panel administrativo
- ✅ Notificaciones multicanal

Estos diseños sirven como base para el desarrollo del frontend y pueden ser refinados durante las iteraciones del proyecto.
