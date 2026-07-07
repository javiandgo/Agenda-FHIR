Proyecto Integrador.

Como Analista de Interoperabilidad, requiero desarrollar una solución para unificar el sistema de agendas de una institución prestadora de servicios de salud, que permita a los pacientes solicitar citas en los tres (3) puntos de atención de la organización.

Para ello, se requiere diseñar un modelo común de datos e interoperabilidad, empleando recursos FHIR.

Características del escenario.

La organización ACME Salud es una institución prestadora de servicios de salud, para atención de primer y segundo nivel de complejidad, que cuenta con tres (3) puntos de atención, en los cuales se han habilitado diferentes servicios:

| Clínica | Identificador | Servicios                                       |
| :------ | :------------ | :---------------------------------------------- |
| Norte   | 1100155555-1  | Medicina general, pediatría, obstetrícia        |
| Centro  | 1100155555-2  | Medicina general, nefrología, gastroenterología |
| Sur     | 1100155555-2  | Medicina general, oncología, cardiología        |

Los médicos especialistas con mayor demanda de solicitudes en ACME Salud son:

| Nombre             | Tarjeta Profesional | Especialidad       |
| :----------------- | :------------------ | :----------------- |
| Gregorio Casas     | 111222333           | Pediatría          |
| Elmer Luna         | 222333444           | Gineco Obstetrícia |
| Luis Manuel Chávez | 333444555           | Nefrología         |
| Alvaro Silva       | 444777333           | Gastroenterología  |
| Diego Narvaez      | 555222999           | Oncología          |
| Alonso Fonseca     | 777666555           | Cardiología        |

ACME Salud tiene convenios firmados con dos aseguradoras:
Salud Completa.
Salud Cooperativa.

Los servicios de consulta externa, tienen diferentes asignaciones de tiempo, de acuerdo con la siguiente tabla:

| Tipo de consulta                                       | Asegurador Salud Cooperativa | Asegurador Salud Completa |
| :----------------------------------------------------- | :--------------------------- | :------------------------ |
| Primera vez consulta medicina general                  | 30 min                       | 45 min                    |
| Primera vez consulta especializada                     | 45 min                       | 60 min                    |
| Control medicina general                               | 20 min                       | 30 min                    |
| Control medicina especializada                         | 30 min                       | 45 min                    |
| Control modalidad telemedicina, medicina general       | 15 min                       | 25 min                    |
| Control modalidad telemedicina, medicina especializada | 20 min                       | 30 min                    |

Los pacientes pueden solicitar una cita, a través de cualquiera de los siguientes canales de atención:
Sitio web de ACME Salud.
Call Center (sistema de call center).
Aplicación móvil de ACME Salud.
Ventanilla de información en cada uno de los puntos de atención (módulo de agendas del sistema HIS).
Requerimientos.

La solución tiene los siguientes requerimientos específicos:
Cada servicio especializado (HealthcareService) tiene su propia agenda (Schedule), que se define mensualmente.
A su vez, cada uno de los médicos especialistas de mayor demanda (Practitioner), en su rol de empleado (PractitionerRole) de ACME Salud, tiene su propia agenda (Schedule), que se define mensualmente.
La información de los pacientes (Patient), deberá relacionarse con la información de cobertura (Coverage), para determinar los tiempos de consulta, de acuerdo con la organización aseguradora (organization), con las cuales tiene convenios.
Cuando el paciente solicita una cita (Appointment), a través de un canal de atención, se requiere registrar un espacio de tiempo (Slot), dentro de la agenda.

Un servidor central tipo FHIR System, recibe las solicitudes de citas (Appointment), provenientes del sistema de informacion de cada canal de atención, con el fin de mantener el control de las agendas (Schedule).

Una vez la cita a sido agendada, el paciente recibe una respuesta (AppointmentResponse), informando la hora de la cita (inicio y final), el servicio de salud, el médico que va a atenderlo y los comentarios necesarios.

Si un paciente cancela una cita (Appointment), el estado (Appointment.status) del registro de la misma debe cambiar y registrarse el motivo de cancelación (Appointment.cancelationReason).

Cada equipo deberá:
Preparar una presentación de máximo 30 minutos, para presentar los resultados de su proyecto.
Incluir los ejemplos del modelo de datos (recursos FHIR)
Incluir wireframes o mockups de las interfaces gráficas de usuario del proyecto.
Incluir fuentes bibliográficas de su investigación.
