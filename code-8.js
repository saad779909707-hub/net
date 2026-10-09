export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Escape user data before inserting into HTML (XSS protection). */
export function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function debounce(fn, ms = 300) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
export function throttle(fn, ms = 500) {
  let last = 0, t; return (...a) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...a); }
    else { clearTimeout(t); t = setTimeout(() => { last = Date.now(); fn(...a); }, ms - (now - last)); }
  };
}

export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); return true; } finally { ta.remove(); }
  }
}

export function isValidIP(ip) {
  return /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/.test(String(ip).trim());
}
export function isValidMAC(mac) {
  return /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i.test(String(mac).trim());
}
/** Only allow safe shell argument characters for generated commands. */
export function sanitizeArg(v) {
  return String(v ?? '').replace(/[^a-zA-Z0-9._:\-/]/g, '');
}
export function formatBytes(b) {
  b = Number(b) || 0;
  const u = ['B','KB','MB','GB','TB']; let i = 0;
  while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
  return `b.toFixed(i?1:0){b.toFixed(i ? 1 : 0)}b.toFixed(i?1:0){u[i]}`;
}
export function formatUptime(s) {
  s = Number(s) || 0;
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  return `d?d+′d′:′′{d ? d + 'd ' : ''}d?d+′d′:′′{h}h ${m}m`;
}
export function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
