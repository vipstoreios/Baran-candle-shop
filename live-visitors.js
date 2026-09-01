/* Baran Candle Shop — real live visitor counter
   Requires the Live Visitors SQL migration to be run in Supabase.
   Uses real active sessions only; no fake/random numbers. */
(() => {
  'use strict';

  const SUPABASE_URL = 'https://oyaczputirsxfmphnlsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_RIIPZJOicijVs_gSBZ5xEQ_ingyuZgR';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const VISITOR_KEY = 'baran-live-visitor-id';
  const SESSION_KEY = 'baran-live-session-id';
  const UNIQUE_DAY_KEY = 'baran-live-unique-day';

  let client = null;
  let sessionId = null;

  const makeId = () => window.crypto?.randomUUID?.() ||
    `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

  const getPersistentId = key => {
    let value = localStorage.getItem(key);
    if (!value) {
      value = makeId();
      localStorage.setItem(key, value);
    }
    return value;
  };

  function loadSupabase() {
    if (window.supabase?.createClient) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SUPABASE_CDN;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function ensureBadge() {
    if (document.getElementById('baranLiveVisitors')) return;

    const badge = document.createElement('div');
    badge.id = 'baranLiveVisitors';
    badge.setAttribute('aria-live', 'polite');
    badge.innerHTML = '<span class="baran-live-dot"></span><span class="baran-live-copy"><b>0</b> <span></span></span>';

    const style = document.createElement('style');
    style.textContent = `
      #baranLiveVisitors{position:fixed;left:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:9px;padding:10px 14px;border:1px solid rgba(112,82,50,.16);border-radius:999px;background:rgba(255,252,247,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 12px 35px rgba(49,34,22,.12);color:#4b3526;font:12px/1.2 'DM Sans',sans-serif;direction:rtl}
      #baranLiveVisitors .baran-live-dot{width:8px;height:8px;flex:none;border-radius:50%;background:#39a96b;box-shadow:0 0 0 4px rgba(57,169,107,.14);animation:baranLivePulse 1.8s ease-in-out infinite}
      #baranLiveVisitors b{font-size:14px}
      @keyframes baranLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}
      @media(max-width:600px){#baranLiveVisitors{left:10px;bottom:10px;padding:8px 11px;font-size:11px}}
    `;
    document.head.appendChild(style);
    document.body.appendChild(badge);
    updateLabel();
  }

  function updateLabel() {
    const label = document.querySelector('#baranLiveVisitors .baran-live-copy span');
    if (!label) return;
    const lang = localStorage.getItem('baran-language') || 'badini';
    const labels = {
      badini: 'کەس ئێستا لە سایتەکەیە',
      sorani: 'کەس ئێستا لە وێبسایتەکەیە',
      arabic: 'شخص يتصفح الموقع الآن',
      english: 'people viewing now'
    };
    label.textContent = labels[lang] || labels.english;
  }

  function updateCount(count) {
    ensureBadge();
    const number = document.querySelector('#baranLiveVisitors .baran-live-copy b');
    if (number) number.textContent = String(Number(count) || 0);
    updateLabel();
  }

  async function refreshCount() {
    if (!client) return;
    const { data, error } = await client.rpc('get_live_visitor_count');
    if (!error) updateCount(data);
  }

  async function heartbeat() {
    if (!client || !sessionId || document.visibilityState === 'hidden') return;
    await client.rpc('visitor_heartbeat', {
      p_session_id: sessionId,
      p_page_path: location.pathname || '/'
    });
    await refreshCount();
  }

  async function start() {
    try {
      await loadSupabase();
      if (!window.supabase?.createClient) return;

      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      const visitorId = getPersistentId(VISITOR_KEY);
      sessionId = getPersistentId(SESSION_KEY);
      const language = localStorage.getItem('baran-language') || 'badini';
      const pagePath = location.pathname || '/';
      const today = new Date().toISOString().slice(0, 10);

      const { error: liveError } = await client.rpc('track_live_visitor', {
        p_visitor_id: visitorId,
        p_session_id: sessionId,
        p_page_path: pagePath,
        p_language: language,
        p_user_agent: navigator.userAgent || ''
      });
      if (liveError) throw liveError;

      await client.rpc('track_page_view', {
        p_visitor_id: visitorId,
        p_session_id: sessionId,
        p_page_path: pagePath,
        p_language: language
      });

      if (localStorage.getItem(UNIQUE_DAY_KEY) !== today) {
        localStorage.setItem(UNIQUE_DAY_KEY, today);
        await client.rpc('track_unique_visitor', {
          p_visitor_id: visitorId,
          p_session_id: sessionId,
          p_page_path: pagePath,
          p_language: language
        });
      }

      ensureBadge();
      await refreshCount();
      setInterval(heartbeat, 30000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') heartbeat();
      });
    } catch (error) {
      console.warn('[Baran Live Visitors]', error?.message || error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
