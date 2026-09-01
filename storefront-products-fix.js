/* Baran storefront live-products/image/font fix */
(() => {
  'use strict';
  const SUPABASE_URL = 'https://oyaczputirsxfmphnlsh.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzIiLCJpYXQiOjE3ODgyNTQ0NzUsImV4cCI6MjEwMzgzMDQ3NX0.fiOo-DfZAHC2vhge9W4_IAbIEVDsP3xtSFkHFgHXE0M';
  const $ = s => document.querySelector(s);
  let dbProducts = [], activeFilter = 'all', busy = false;
  const lang = () => localStorage.getItem('baran-language') || 'badini';
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const nameOf = p => p[`name_${lang()}`] || p.name_badini || p.name_sorani || p.name_arabic || p.name_english || 'Baran';
  const money = p => `$${Number(p.price || 0).toFixed(2)}`;

  function installFont() {
    if (!document.getElementById('baran-better-font')) {
      const l = document.createElement('link'); l.id='baran-better-font'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap';
      document.head.appendChild(l);
    }
    if (!document.getElementById('baran-better-font-css')) {
      const s=document.createElement('style'); s.id='baran-better-font-css';
      s.textContent=`html,body,button,input,select,textarea,a{font-family:"Noto Sans Arabic","DM Sans",sans-serif!important}body{font-feature-settings:"kern" 1,"liga" 1;text-rendering:optimizeLegibility}.product-img{height:335px!important;min-height:335px!important;display:block!important;position:relative!important;overflow:hidden!important;background:#f1ebe3!important}.product-img .product-real-image{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;position:relative!important;z-index:2!important;transition:transform .45s ease,opacity .25s ease}.product-card:hover .product-real-image{transform:scale(1.04)}.product-image-fallback{height:100%;display:grid;place-items:center;font-size:42px;opacity:.45}.product-card .product-info{position:relative;z-index:3}.product-card .add{position:relative;z-index:4;cursor:pointer}`;
      document.head.appendChild(s);
    }
  }

  async function load() {
    const url = SUPABASE_URL + '/rest/v1/products?select=id,category_id,slug,name_badini,name_sorani,name_arabic,name_english,description_badini,description_sorani,description_arabic,description_english,wax_type,burn_time_minutes,price,stock,featured,bestseller,new_arrival,active,image_url,images,created_at&order=created_at.desc';
    const r = await fetch(url, {headers:{apikey:SUPABASE_ANON_KEY,Authorization:'Bearer '+SUPABASE_ANON_KEY,Accept:'application/json'}});
    if (!r.ok) throw new Error('products '+r.status);
    const data = await r.json(); dbProducts = Array.isArray(data) ? data : []; render();
  }

  function imageFor(p) {
    if (p.image_url && /^https?:\/\//i.test(p.image_url.trim())) return p.image_url.trim();
    if (Array.isArray(p.images)) { const x=p.images.find(v=>typeof v==='string' && /^https?:\/\//i.test(v.trim())); if(x)return x.trim(); }
    return '';
  }
  function meta(p) { const wax=p.wax_type||''; const burn=p.burn_time_minutes?`${Math.round(Number(p.burn_time_minutes)/60)}h`:''; return [wax,burn].filter(Boolean).join(' · '); }

  function render() {
    const grid=$('#productGrid'); if(!grid || busy)return; busy=true;
    let a=dbProducts.filter(p=>p.active!==false && (activeFilter==='all' || String(p.category_id||'')===activeFilter || String(p.category?.slug||'')===activeFilter));
    const q=($('#search')?.value||'').trim().toLocaleLowerCase();
    if(q)a=a.filter(p=>Object.values(p).some(v=>typeof v==='string' && v.toLocaleLowerCase().includes(q)));
    const sort=$('#sort')?.value;
    if(sort==='low')a.sort((x,y)=>Number(x.price||0)-Number(y.price||0));
    if(sort==='high')a.sort((x,y)=>Number(y.price||0)-Number(x.price||0));
    if(sort==='featured')a.sort((x,y)=>Number(y.featured)-Number(x.featured)||Number(y.bestseller)-Number(x.bestseller));
    grid.innerHTML=a.length?a.map(p=>{const img=imageFor(p),n=nameOf(p);return `<article class="product-card" data-product-id="${esc(p.id)}"><div class="product-img">${img?`<img class="product-real-image" src="${esc(img)}" alt="${esc(n)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove();this.parentElement.insertAdjacentHTML('beforeend','<div class=\"product-image-fallback\">✦</div>')">`:'<div class="product-image-fallback">✦</div>'}</div><div class="product-info"><h3>${esc(n)}</h3><div class="product-meta">${esc(meta(p))}</div><div class="product-bottom"><strong class="price">${money(p)}</strong><button class="add" type="button" data-db-add="${esc(p.id)}">+</button></div></div></article>`}).join(''):`<p>${lang()==='english'?'No products found.':lang()==='arabic'?'لا توجد منتجات.':'هیچ بەرهەمێک نەدۆزرایەوە.'}</p>`;
    busy=false;
  }

  function hook() {
    $('#search')?.addEventListener('input',render); $('#sort')?.addEventListener('change',render); $('#language')?.addEventListener('change',()=>setTimeout(render,50));
    document.addEventListener('click',e=>{
      const b=e.target.closest('.filter'); if(b)setTimeout(()=>{activeFilter=b.dataset.filter||'all';render()},0);
      const c=e.target.closest('.category[data-filter]'); if(c)setTimeout(()=>{activeFilter=c.dataset.filter||'all';render()},0);
      const add=e.target.closest('[data-db-add]'); if(add){e.preventDefault();e.stopPropagation();const id=add.dataset.dbAdd,cart=JSON.parse(localStorage.getItem('baran-db-cart')||'[]');const x=cart.find(i=>i.id===id);x?x.qty++:cart.push({id,qty:1});localStorage.setItem('baran-db-cart',JSON.stringify(cart));const t=$('#toast');if(t){t.textContent=lang()==='english'?'Added to cart.':lang()==='arabic'?'تمت الإضافة إلى السلة.':'زیادکرا بۆ سەبەتە.';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}}
    },true);
  }
  function start(){installFont();hook();load().catch(e=>console.warn('[Baran products]',e));setInterval(()=>load().catch(()=>{}),30000)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
