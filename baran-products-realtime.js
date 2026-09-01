/* BARAN — product realtime safety net
   Keeps the existing storefront renderer untouched.
   Realtime refreshes immediately when available; polling is a fallback.
*/
(() => {
  'use strict';

  const URL = 'https://oyaczputirsxfmphnlsh.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoib3lhY3pwdXRpcnN4Zm1waG5sc2giLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4ODI1NDQ3NSwiZXhwIjoyMTAzODMwNDc1fQ.fiOo-DfZAHC2vhge9W4_IAbIEVDsP3xtSFkHFgHXE0M';
  const SIGNATURE_KEY = 'baran-products-signature-v3';
  let db;
  let reloading = false;

  const sleepReload = () => {
    if (reloading) return;
    reloading = true;
    setTimeout(() => location.reload(), 120);
  };

  async function getSignature() {
    const response = await fetch(
      URL + '/rest/v1/products?select=*&order=created_at.asc',
      {
        headers: {
          apikey: KEY,
          Authorization: 'Bearer ' + KEY,
          Accept: 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) throw new Error('products ' + response.status);
    const rows = await response.json();
    return JSON.stringify(rows);
  }

  async function poll() {
    try {
      const signature = await getSignature();
      const previous = localStorage.getItem(SIGNATURE_KEY);

      if (previous === null) {
        localStorage.setItem(SIGNATURE_KEY, signature);
        return;
      }

      if (previous !== signature) {
        localStorage.setItem(SIGNATURE_KEY, signature);
        sleepReload();
      }
    } catch (error) {
      console.warn('[Baran realtime fallback]', error);
    }
  }

  function subscribe() {
    if (!db) return;

    const channel = db
      .channel('baran-storefront-products')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'products'
      }, () => {
        console.log('[Baran] product change received');
        sleepReload();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'categories'
      }, () => {
        console.log('[Baran] category change received');
        sleepReload();
      });

    channel.subscribe((status, error) => {
      console.log('[Baran] realtime:', status);
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('[Baran] realtime unavailable; polling fallback is active', error || '');
      }
    });
  }

  async function start() {
    if (!window.supabase) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = start;
      script.onerror = () => console.warn('[Baran] Supabase client failed to load');
      document.head.appendChild(script);
      return;
    }

    db = window.supabase.createClient(URL, KEY);
    await poll();
    subscribe();
    setInterval(poll, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
