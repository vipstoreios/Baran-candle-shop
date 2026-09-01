/* Baran runtime loader. The previous storefront logic is kept immutable at its last blob SHA. */
(function(){
  const base='https://vipstoreios.github.io/Baran-candle-shop/';
  const raw='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/546c78af73a1347ee50a5de27d5f2d4250a01eb1/script.js';
  function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
  async function boot(){
    try{
      await load(raw);
      await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js');
      await load(base+'supabase-config.js');
      await load(base+'baran-live.js');
    }catch(e){console.error('Baran runtime failed',e);}
  }
  boot();
})();
