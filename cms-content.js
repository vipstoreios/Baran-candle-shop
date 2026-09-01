/* Baran Candle Shop — Admin-managed multilingual storefront content */
(() => {
  'use strict';
  const url = window.BARAN_SUPABASE_URL;
  const key = window.BARAN_SUPABASE_KEY;
  if (!url || !key || !window.supabase) return;
  const db = window.supabase.createClient(url, key);
  const language = localStorage.getItem('baranLanguage') || localStorage.getItem('language') || 'badini';

  const apply = rows => {
    const map = Object.fromEntries(rows.map(r => [r.content_key, r]));
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const r = map[el.dataset.i18n];
      if (!r) return;
      const value = r[language] ?? r.badini;
      if (value == null) return;
      if (r.content_type === 'html') el.innerHTML = value;
      else el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const r = map[el.dataset.i18nPlaceholder];
      if (r) el.placeholder = r[language] ?? r.badini;
    });
    const badge = map.collectionBadge;
    const badgeEl = document.querySelector('.collection-badge');
    if (badge && badgeEl) badgeEl.textContent = badge[language] ?? badge.badini;
  };

  const load = async () => {
    const { data } = await db.from('site_content').select('*').eq('active', true).order('sort_order');
    if (data?.length) apply(data);
  };

  window.addEventListener('baran:language-changed', load);
  load();
})();
