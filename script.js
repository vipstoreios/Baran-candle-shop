/* Baran runtime loader. Keeps the original storefront UI logic and adds the live Supabase layer. */
(function(){
  const rawBase='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/main/';
  const legacy='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/da4795c863aacd087405c229bb51df472f9c57f8/script.js';
  function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
  async function boot(){
    try{
      await load(legacy);
      await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
      await load(rawBase+'supabase-config.js');
      await load(rawBase+'baran-live.js');
    }catch(e){console.error('Baran runtime failed',e);}
  }
  boot();
})();
