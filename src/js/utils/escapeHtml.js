const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => HTML_ESCAPE_MAP[character]);
}
