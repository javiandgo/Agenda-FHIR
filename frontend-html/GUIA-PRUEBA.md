# 🚀 Guía de Prueba - Prototipo Frontend

## Acceso Rápido

### Con XAMPP (Recomendado en Windows)

1. **Verificar XAMPP está corriendo:**
   - Apache debe estar activo en XAMPP Control Panel

2. **Abrir en navegador:**
   ```
   http://localhost/Agenda-FHIR/frontend-html/
   ```

### Con Servidor Local Alternativo

#### Python

```bash
cd c:\xampp\htdocs\Agenda-FHIR\frontend-html
python -m http.server 8000
```

Abrir: http://localhost:8000

#### PHP

```bash
cd c:\xampp\htdocs\Agenda-FHIR\frontend-html
php -S localhost:8000
```

Abrir: http://localhost:8000

#### Node.js

```bash
cd c:\xampp\htdocs\Agenda-FHIR\frontend-html
npx http-server -p 8000
```

Abrir: http://localhost:8000

---

## 📱 Páginas Disponibles

### 1. Página Principal

**URL:** `index.html`

**Qué ver:**

- Hero section con gradiente
- 3 tarjetas de características (Agendamiento fácil, Múltiples canales, Historial)
- 3 tarjetas de clínicas (Norte, Centro, Sur)
- Footer con información de contacto

**Acciones:**

- Click en "Agendar Cita Ahora" → va a agendar-cita.html
- Click en "Ver ubicación" (en las clínicas) → actualmente solo link

### 2. Flujo de Agendamiento (4 Pasos)

**URL:** `agendar-cita.html`

**Paso 1: Selección de Especialidad**

- 6 especialidades disponibles:
  - Pediatría (98 cupos disponibles)
  - Gineco Obstetricia (45 cupos)
  - Cardiología (32 cupos)
  - Nefrología (28 cupos)
  - Oncología (15 cupos)
  - Gastroenterología (51 cupos)

**Acciones:**

- Usar búsqueda para filtrar especialidades
- Click en "Seleccionar" → activa botón "Siguiente"
- Click en "Siguiente" → va al Paso 2

**Paso 2: Selección de Médico**

- Filtros por ubicación (Norte, Centro, Sur)
- 3 médicos de ejemplo (Dr. Gregorio Casas, Dra. Elmer Luna, Dr. Luis Manuel Chávez)
- Información mostrada:
  - Foto/avatar
  - Nombre y especialidad
  - Calificación (estrellas)
  - Años de experiencia
  - Próxima disponibilidad

**Acciones:**

- Click en chips de ubicación → filtra médicos (futuro)
- Click en "Seleccionar Médico" → activa botón "Siguiente"
- Click en "Anterior" → vuelve al Paso 1
- Click en "Siguiente" → va al Paso 3

**Paso 3: Fecha y Hora**

- Calendario del mes actual
  - Días disponibles en azul con punto verde
  - Días no disponibles en gris
- Slots de horarios:
  - Mañana: 4 opciones (7:00, 8:00, 9:00, 10:00)
  - Tarde: 4 opciones (14:00, 15:00, 16:00, 17:00)
- Duración mostrada: 30 minutos

**Acciones:**

- Click en día disponible → se marca en azul
- Click en horario → se marca como seleccionado
- Click en "Anterior" → vuelve al Paso 2
- Click en "Siguiente" → va al Paso 4 (requiere fecha y hora seleccionadas)

**Paso 4: Confirmación**

- Resumen de la cita:
  - Fecha y hora
  - Médico
  - Especialidad
  - Ubicación con opción "Ver mapa"
  - Cobertura (EPS)
- Información importante:
  - Llegada con 15 minutos de anticipación
  - Traer documento y carnet
  - Política de cancelación
  - Recordatorios automáticos
- Términos y condiciones:
  - Checkbox 1: Acepto términos
  - Checkbox 2: Autorizo tratamiento de datos

**Acciones:**

- Click en "Ver mapa" → futuro (Google Maps integration)
- Marcar ambos checkboxes → activa botón "Confirmar Cita"
- Click en "Anterior" → vuelve al Paso 3
- Click en "Confirmar Cita" → va a confirmacion.html

### 3. Confirmación de Cita

**URL:** `confirmacion.html`

**Qué ver:**

- Header de éxito (gradiente azul-verde)
- Icono de check animado
- Número de confirmación (ej: ACM-2026-04521)
- Resumen completo de la cita
- Notas importantes (fondo naranja)
- Botones de acción:
  - Descargar PDF
  - Agregar a Calendario
  - Volver al Inicio
  - Agendar otra cita

**Acciones:**

- Click en "Descargar PDF" → muestra alert (funcionalidad futura)
- Click en "Agregar a Calendario" → muestra alert (funcionalidad futura)
- Click en "Volver al Inicio" → va a index.html
- Click en "Agendar otra cita" → va a agendar-cita.html

---

## 🎨 Elementos de Material Design 3

### Colores

- **Primary (Azul):** #0066CC - Botones principales, enlaces, iconos
- **Secondary (Verde):** #00A859 - Acentos, badges, success states
- **Tertiary (Morado):** #7B61FF - Elementos decorativos
- **Error (Rojo):** #BA1A1A - Mensajes de error

### Componentes

- `md-filled-button` - Botones principales (azul sólido)
- `md-outlined-button` - Botones secundarios (borde azul)
- `md-text-button` - Botones de texto (sin fondo)
- `md-outlined-card` - Tarjetas con borde
- `md-filter-chip` - Chips de filtro
- `md-checkbox` - Casillas de verificación
- `md-outlined-text-field` - Campos de texto

### Animaciones

- Fade in al cargar (tarjetas en index.html)
- Slide up (stepper en agendar-cita.html)
- Scale in (icono de éxito en confirmacion.html)
- Hover effects (todos los botones y tarjetas)

---

## 📱 Responsive Testing

### Breakpoints

- **Desktop:** > 768px (vista completa)
- **Tablet:** 481px - 768px (2 columnas)
- **Mobile:** ≤ 480px (1 columna)

### Probar en:

1. **Chrome DevTools:**
   - F12 → Toggle device toolbar
   - Probar: iPhone SE (375px), iPad (768px), Desktop (1920px)

2. **Dispositivos reales:**
   - Escanear QR con teléfono (si servidor local permite acceso red)

### Elementos responsive:

- Grid de especialidades: 3 cols → 1 col
- Tarjetas de médicos: horizontal → vertical
- Calendario: tamaño de fuente reducido
- Botones: ancho completo en móvil
- Stepper: scroll horizontal en móvil

---

## 🐛 Troubleshooting

### Página en blanco

**Problema:** Componentes de Material Design no cargan

**Solución:**

1. Verificar conexión a internet (componentes via CDN)
2. Verificar consola del navegador (F12)
3. Probar en navegador actualizado (Chrome 90+, Firefox 88+, Safari 14+)

### Estilos no se aplican

**Problema:** CSS no carga

**Solución:**

1. Verificar ruta de archivos CSS (`css/styles.css`)
2. Limpiar caché del navegador (Ctrl+Shift+R)
3. Verificar que archivos CSS existen

### JavaScript no funciona

**Problema:** Navegación del wizard no funciona

**Solución:**

1. Abrir consola del navegador (F12)
2. Verificar errores en consola
3. Verificar que `js/main.js` y `js/agendar.js` cargan correctamente

### Iconos no aparecen

**Problema:** Material Icons no cargan

**Solución:**

1. Verificar conexión a internet (iconos via Google Fonts)
2. Verificar link en `<head>`: `https://fonts.googleapis.com/icon?family=Material+Icons`

---

## ✅ Checklist de Prueba

### Funcional

- [ ] Página principal carga correctamente
- [ ] Botón "Agendar Cita" redirige a agendar-cita.html
- [ ] Búsqueda de especialidades filtra resultados
- [ ] Selección de especialidad activa botón "Siguiente"
- [ ] Navegación entre pasos funciona (1→2→3→4)
- [ ] Botón "Anterior" funciona en todos los pasos
- [ ] Selección de médico funciona
- [ ] Calendario muestra días disponibles
- [ ] Selección de fecha y hora funciona
- [ ] Validación de términos funciona (checkboxes)
- [ ] Confirmación muestra datos correctos
- [ ] Botones "Volver al Inicio" y "Agendar otra cita" funcionan

### Visual

- [ ] Colores según paleta Keralty (azul/verde)
- [ ] Tipografía Roboto se aplica correctamente
- [ ] Iconos Material Icons se muestran
- [ ] Tarjetas tienen sombras (elevation)
- [ ] Botones tienen hover effects
- [ ] Animaciones funcionan suavemente
- [ ] Layout responsive en mobile/tablet/desktop

### Performance

- [ ] Página carga en < 3 segundos
- [ ] No hay errores en consola
- [ ] Navegación es fluida (sin lag)
- [ ] Animaciones no causan jank

---

## 📊 Métricas de Éxito

### Usabilidad

- ✅ Flujo completo de agendamiento en < 2 minutos
- ✅ Menos de 4 clicks para agendar cita
- ✅ Navegación intuitiva (sin instrucciones)

### Técnicas

- ✅ First Contentful Paint < 1.5s
- ✅ Time to Interactive < 3s
- ✅ Lighthouse Accessibility Score > 90

### Diseño

- ✅ Cumple Material Design 3 guidelines
- ✅ Paleta Keralty aplicada consistentemente
- ✅ Responsive en todos los breakpoints

---

## 🔄 Próximos Pasos

1. **Integración Backend:**
   - Reemplazar datos mock con llamadas FHIR API
   - Implementar autenticación OAuth 2.0

2. **Mejoras UX:**
   - Skeleton screens mientras carga
   - Mensajes de error más informativos
   - Confirmación de email/SMS real

3. **Funcionalidades Adicionales:**
   - Cancelar/reagendar citas
   - Historial de citas
   - Perfil de usuario
   - Notificaciones push

---

**Happy Testing! 🎉**

Para reportar problemas o sugerencias: desarrollo@acmesalud.com
