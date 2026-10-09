/**
 * Centralized LocalStorage manager.
 * NOTE: passwords are NEVER stored by default (see settings.js "rememberPassword").
 */
const PREFIX = 'netcontrol:';
const DEFAULTS = {
  theme: 'dark',            // dark | light | system
  lang: 'ar',               // ar | en
  routerIP: '', routerPort: '80', routerProto: 'http',
  routerUser: 'root',
  rememberPassword: false,  // opt-in only
  autoRefresh: true,
  refreshInterval: 15,      // seconds
  favorites: [],            // favorite command ids
  demoMode: true,           // use simulated router data until API is connected
  lastInterface: 'eth0'
};

class Storage {
  constructor() { this.cache = this._load(); }
  _load() {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(PREFIX + 'state') || '{}') }; }
    catch { return { ...DEFAULTS }; }
  }
  get(key) { return this.cache[key]; }
  set(key, value) {
    this.cache[key] = value;
    try { localStorage.setItem(PREFIX + 'state', JSON.stringify(this.cache)); }
    catch (e) { console.warn('Storage quota exceeded', e); }
  }
  remove(key) { delete this.cache[key]; this.set('_flush', null); this.cache[key] = undefined; }
  reset() {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
    this.cache = { ...DEFAULTS };
  }
  /** Session-only secret storage (cleared on tab close). Never persisted. */
  setSecret(key, val) { sessionStorage.setItem(PREFIX + key, val ?? ''); }
  getSecret(key) { return sessionStorage.getItem(PREFIX + key) || ''; }
  clearSecrets() {
    Object.keys(sessionStorage).filter(k => k.startsWith(PREFIX)).forEach(k => sessionStorage.removeItem(k));
  }
}

export const store = new Storage();
