export default function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('es-AR', { timeZone: 'UTC' });
}
