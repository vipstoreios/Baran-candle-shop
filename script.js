/* Baran runtime loader — scroll-safe boot + legacy UI + complete i18n + live Supabase layer. */
(function(){
  // A refresh of the landing page must always start at the hero, never at the last anchor/scroll position.
  // Browsers may restore scroll position automatically, and hash links can also force an anchor on reload.
  try {
    if ('scrollRestoration' in history) history.scrollRestoration='manual';
    if (location.hash) history.replaceState(null, document.title, location.pathname + location.search);
    window.scrollTo({top:0,left:0,behavior:'instant'});
    requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'instant'}));
    window.addEventListener('load',()=>window.scrollTo({top:0,left:0,behavior:'instant'}),{once:true});
  } catch(e) { window.scrollTo(0,0); }

  const rawBase='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/main/';
  const legacy='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/da4795c863aacd087405c229bb51df472f9c57f8/script.js';
  function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
  load(legacy).catch(err=>console.error('Baran runtime failed to load:',err));
})();