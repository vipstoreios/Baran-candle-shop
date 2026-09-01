/* BARAN — product realtime + image safety net
   Keeps the existing storefront renderer untouched.
   Realtime refreshes immediately when available; polling is a fallback.
   Also normalizes common admin-panel image sharing links.
*/
(() => {
  'use strict';

  const URL = 'https://oyaczputirsxfmphnlsh.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiwicmVmIjoib3lhY3pwdXRpcnN4Zm1waG5sc2giLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc4ODI1NDQ3NSwiZXhwIjoyMTAzODMwNDc1fQ.fiOo-DfZAHC2vhge9W4_IAbIEVDsP3xtSFkHFgHXE0M';
  const SIGNATURE_KEY = 'baran-products-signature-v4';
  let db;
  let reloading = false;

  const sleepReload = () => {
    if (reloading) return;
    reloading = true;
    setTimeout(() => location.reload(), 120);
  };

  function normalizeImageUrl(value) {
    if (!value || typeof value !== 'string') return '';
    const raw = value.trim();

    // Google Drive: https://drive.google.com/file/d/FILE_ID/view
    const drive = raw.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (drive) return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(drive[1]);

    // Google Drive open?id=FILE_ID / uc?id=FILE_ID
    const driveId = raw.match(/[?&]id=([^&]+)/i);
    if (/drive\.google\.com/i.test(raw) && driveId) {
      return 'https://drive.google.com/uc?export=view&id=' + encodeURIComponent(driveId[1]);
    }

    // Dropbox shared links
    if (/dropbox\.com/i.test(raw)) {
      return raw.replace(/[?&]dl=0\b/i, '').replace(/[?&]raw=0\b/i, '') + (raw.includes('?') ? '&raw=1' : '?raw=1');
    }

    return raw;
  }

  function normalizeRenderedImages(root = document) {
    root.querySelectorAll?.('img.product-real-image').forEach(img => {
      const original = img.getAttribute('src') || '';
      const normalized = normalizeImageUrl(original);
      if (normalized && normalized !== original && !img.dataset.baranNormalized) {
        img.dataset.baranNormalized = '1';
        img.src = normalized;
      }
      img.referrerPolicy = 'no-referrer';
      img.decoding = 'async';
    });
  }

  function watchRenderedImages() {
    const grid = document.querySelector('#productGrid');
    if (!grid || grid.dataset.baranImageWatcher) return;
    grid.dataset.baranImageWatcher = '1';
    normalizeRenderedImages(grid);
    new MutationObserver(() => normalizeRenderedImages(grid)).observe(grid, { childList: true, subtree: true });
  }

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
    watchRenderedImages();

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
