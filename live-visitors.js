/* Baran Candle Shop — real live visitor counter + CMS bootstrap */
(() => {
  'use strict';
  const SUPABASE_URL = 'https://oyaczputirsxfmphnlsh.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_RIIPZJOicijVs_gSBZ5xEQ_ingyuZgR';
  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const VISITOR_KEY = 'baran-live-visitor-id';
  const SESSION_KEY = 'baran-live-session-id';
  const UNIQUE_DAY_KEY = 'baran-live-unique-day';
  let client = null, sessionId = null;
  const makeId=()=>window.crypto?.randomUUID?.()||`v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,12)}`;
  const getPersistentId=key=>{let v=localStorage.getItem(key);if(!v){v=makeId();localStorage.setItem(key,v)}return v};
  function loadSupabase(){if(window.supabase?.createClient)return Promise.resolve();return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=SUPABASE_CDN;s.async=true;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  function ensureBadge(){if(document.getElementById('baranLiveVisitors'))return;const b=document.createElement('div');b.id='baranLiveVisitors';b.setAttribute('aria-live','polite');b.innerHTML='<span class="baran-live-dot"></span><span class="baran-live-copy"><b>0</b> <span></span></span>';const s=document.createElement('style');s.textContent=`#baranLiveVisitors{position:fixed;left:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:9px;padding:10px 14px;border:1px solid rgba(112,82,50,.16);border-radius:999px;background:rgba(255,252,247,.88);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 12px 35px rgba(49,34,22,.12);color:#4b3526;font:12px/1.2 'DM Sans',sans-serif;direction:rtl}#baranLiveVisitors .baran-live-dot{width:8px;height:8px;flex:none;border-radius:50%;background:#39a96b;box-shadow:0 0 0 4px rgba(57,169,107,.14);animation:baranLivePulse 1.8s ease-in-out infinite}#baranLiveVisitors b{font-size:14px}@keyframes baranLivePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.82)}}@media(max-width:600px){#baranLiveVisitors{left:10px;bottom:10px;padding:8px 11px;font-size:11px}}`;document.head.appendChild(s);document.body.appendChild(b);updateLabel()}
  function updateLabel(){const l=document.querySelector('#baranLiveVisitors .baran-live-copy span');if(!l)return;const lang=localStorage.getItem('baran-language')||'badini';l.textContent=({badini:'کەس ئێستا لە سایتەکەیە',sorani:'کەس ئێستا لە وێبسایتەکەیە',arabic:'شخص يتصفح الموقع الآن',english:'people viewing now'})[lang]||'people viewing now'}
  function updateCount(n){ensureBadge();const e=document.querySelector('#baranLiveVisitors .baran-live-copy b');if(e)e.textContent=String(Number(n)||0);updateLabel()}
  async function refreshCount(){if(!client)return;const{data,error}=await client.rpc('get_live_visitor_count');if(!error)updateCount(data)}
  async function heartbeat(){if(!client||!sessionId||document.visibilityState==='hidden')return;await client.rpc('visitor_heartbeat',{p_session_id:sessionId,p_page_path:location.pathname||'/'});await refreshCount()}
  async function loadCMS(){if(!client)return;const{data}=await client.from('site_content').select('*').eq('active',true).order('sort_order');if(!data?.length)return;const lang=localStorage.getItem('baran-language')||'badini';const map=Object.fromEntries(data.map(r=>[r.content_key,r]));document.querySelectorAll('[data-i18n]').forEach(el=>{const r=map[el.dataset.i18n];if(!r)return;const v=r[lang]??r.badini;if(r.content_type==='html')el.innerHTML=v;else el.textContent=v});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const r=map[el.dataset.i18nPlaceholder];if(r)el.placeholder=r[lang]??r.badini});const badge=map.collectionBadge,be=document.querySelector('.collection-badge');if(badge&&be)be.textContent=badge[lang]??badge.badini}
  async function start(){try{await loadSupabase();if(!window.supabase?.createClient)return;client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);const visitorId=getPersistentId(VISITOR_KEY);sessionId=getPersistentId(SESSION_KEY);const language=localStorage.getItem('baran-language')||'badini',pagePath=location.pathname||'/',today=new Date().toISOString().slice(0,10);const{error:liveError}=await client.rpc('track_live_visitor',{p_visitor_id:visitorId,p_session_id:sessionId,p_page_path:pagePath,p_language:language,p_user_agent:navigator.userAgent||''});if(liveError)throw liveError;await client.rpc('track_page_view',{p_visitor_id:visitorId,p_session_id:sessionId,p_page_path:pagePath,p_language:language});if(localStorage.getItem(UNIQUE_DAY_KEY)!==today){localStorage.setItem(UNIQUE_DAY_KEY,today);await client.rpc('track_unique_visitor',{p_visitor_id:visitorId,p_session_id:sessionId,p_page_path:pagePath,p_language:language})}ensureBadge();await refreshCount();await loadCMS();setInterval(heartbeat,30000);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')heartbeat()})}catch(e){console.warn('[Baran]',e?.message||e)}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Load the storefront database/image fix after the visitor bootstrap. */
(() => {
  const loadFix = () => {
    if (document.getElementById('baran-storefront-products-fix')) return;
    const s = document.createElement('script');
    s.id = 'baran-storefront-products-fix';
    s.src = 'storefront-products-fix.js?v=2';
    s.async = true;
    document.body.appendChild(s);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadFix, {once:true});
  else loadFix();
})();
