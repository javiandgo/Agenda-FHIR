// Tabla de duraciones según convenio ACME Salud (minutos)
// Filas: tipo de consulta | Columnas: aseguradora
const DURACION_CONVENIO = {
  'ROUTINE':          { general: { 'ins-salud-cooperativa': 30, 'ins-salud-completa': 45 }, especializada: { 'ins-salud-cooperativa': 45, 'ins-salud-completa': 60 } },
  'FOLLOWUP':         { general: { 'ins-salud-cooperativa': 20, 'ins-salud-completa': 30 }, especializada: { 'ins-salud-cooperativa': 30, 'ins-salud-completa': 45 } },
  'TELEMED_ROUTINE':  { general: { 'ins-salud-cooperativa': 15, 'ins-salud-completa': 25 }, especializada: { 'ins-salud-cooperativa': 20, 'ins-salud-completa': 30 } },
  'TELEMED_FOLLOWUP': { general: { 'ins-salud-cooperativa': 15, 'ins-salud-completa': 25 }, especializada: { 'ins-salud-cooperativa': 20, 'ins-salud-completa': 30 } },
};

const MEDICINA_GENERAL_CODE = '394814009';

function getInsurerId(cov) {
  const payorRef = cov?.payor?.[0]?.reference || '';
  if (payorRef.includes('ins-salud-completa') || (cov?.payor?.[0]?.display || '').toLowerCase().includes('completa')) return 'ins-salud-completa';
  if (payorRef.includes('ins-salud-cooperativa') || (cov?.payor?.[0]?.display || '').toLowerCase().includes('cooperativa')) return 'ins-salud-cooperativa';
  return null;
}

function getServiceCategory(specialtyCode) {
  return (specialtyCode === MEDICINA_GENERAL_CODE || specialtyCode === 'general') ? 'general' : 'especializada';
}

function calcularDuracion(aptTypeCode, serviceCategory, insurerId) {
  const tipoMap = DURACION_CONVENIO[aptTypeCode];
  if (!tipoMap || !insurerId) return null;
  const catMap = tipoMap[serviceCategory] || tipoMap['general'];
  return catMap[insurerId] || null;
}
