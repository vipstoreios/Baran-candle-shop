/* Baran Candle Shop — full content editor for Admin Panel */
(() => {
  'use strict';
  const db = window.supabase?.createClient?.(window.BARAN_SUPABASE_URL, window.BARAN_SUPABASE_KEY);
  if (!db) return;
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  let rows = [];

  const adminWords = {
    dashboard:'سەرەکی', products:'بەرهەم', orders:'داواکاری', customers:'کڕیار', categories:'پۆلێن', scents:'بۆن', content:'دەق و ناوەڕۆک', settings:'ڕێکخستن',
    newProduct:'بەرهەمی نوێ', save:'هەڵگرتن', cancel:'پاشگەزبوونەوە', edit:'دەستکاری', delete:'سڕینەوە', search:'گەڕان', active:'چالاک', inactive:'ناچالاک',
    language:'زمان', badini:'بادینی دهۆکی', sorani:'سۆرانی', arabic:'عەرەبی عێراقی', english:'ئینگلیزی', section:'بەش', key:'کلیلی دەق', updated:'نوێکراوەتەوە'
  };

  function addStyles(){
    if ($('#baranCmsStyle')) return;
    const s=document.createElement('style'); s.id='baranCmsStyle'; s.textContent=`
      #cmsPage .cms-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px}
      #cmsPage .cms-toolbar input,#cmsPage .cms-toolbar select{max-width:260px}
      #cmsPage .cms-list{display:grid;gap:12px}
      #cmsPage .cms-card{background:#fff;border:1px solid var(--line);padding:18px}
      #cmsPage .cms-head{display:flex;justify-content:space-between;gap:14px;align-items:center;margin-bottom:12px}
      #cmsPage .cms-head strong{font-size:13px}
      #cmsPage .cms-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      #cmsPage label{display:grid;gap:5px;font-size:11px;color:var(--muted)}
      #cmsPage textarea{min-height:78px;resize:vertical}
      #cmsPage .cms-save{margin-top:12px}
      @media(max-width:800px){#cmsPage .cms-grid{grid-template-columns:1fr}}
    `; document.head.appendChild(s);
  }

  function inject(){
    if ($('#cmsPage')) return;
    const aside=document.querySelector('aside');
    const main=document.querySelector('main');
    if(!aside||!main)return;
    const b=document.createElement('button'); b.type='button'; b.dataset.tab='cms'; b.textContent=adminWords.content;
    aside.insertBefore(b, aside.querySelector('[data-tab="settings"]'));
    const sec=document.createElement('section'); sec.id='cmsPage'; sec.className='page';
    sec.innerHTML=`<div class="title"><div><div class="eyebrow">BARAN</div><h1>${adminWords.content}</h1></div></div>
      <div class="cms-toolbar"><input id="cmsSearch" placeholder="گەڕان ل ناڤ دەقان..." aria-label="گەڕان"><select id="cmsSection"><option value="">هەمی بەش</option></select><button id="cmsReload" class="btn">نویکرن</button></div>
      <div id="cmsList" class="cms-list"></div>`;
    main.appendChild(sec);
    b.addEventListener('click',()=>{document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));sec.classList.add('active');document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));load();});
    $('#cmsSearch').addEventListener('input',render); $('#cmsSection').addEventListener('change',render); $('#cmsReload').addEventListener('click',load);
    addStyles();
  }

  async function load(){
    const {data,error}=await db.from('site_content').select('*').order('section').order('sort_order');
    if(error){$('#cmsList').innerHTML=`<div class="panel"><div class="error">${esc(error.message)}</div></div>`;return;}
    rows=data||[];
    const sections=[...new Set(rows.map(r=>r.section).filter(Boolean))];
    $('#cmsSection').innerHTML='<option value="">هەمی بەش</option>'+sections.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
    render();
  }

  function render(){
    const q=($('#cmsSearch')?.value||'').toLowerCase(); const section=$('#cmsSection')?.value||'';
    const list=rows.filter(r=>(!section||r.section===section)&&(!q||`${r.content_key} ${r.badini} ${r.sorani} ${r.arabic} ${r.english}`.toLowerCase().includes(q)));
    $('#cmsList').innerHTML=list.map(r=>`<article class="cms-card" data-cms-id="${esc(r.id)}"><div class="cms-head"><strong>${esc(r.content_key)}</strong><span class="eyebrow">${esc(r.section)}</span></div><div class="cms-grid">
      <label>${adminWords.badini}<textarea data-field="badini">${esc(r.badini)}</textarea></label>
      <label>${adminWords.sorani}<textarea data-field="sorani">${esc(r.sorani)}</textarea></label>
      <label>${adminWords.arabic}<textarea data-field="arabic" dir="rtl">${esc(r.arabic)}</textarea></label>
      <label>${adminWords.english}<textarea data-field="english" dir="ltr">${esc(r.english)}</textarea></label>
    </div><button class="btn cms-save" data-save-cms="${esc(r.id)}">${adminWords.save}</button><span class="error" data-msg></span></article>`).join('')||'<div class="panel">هیچ دەقێک نەدۆزرایەوە.</div>';
    document.querySelectorAll('[data-save-cms]').forEach(btn=>btn.addEventListener('click',save));
  }

  async function save(e){
    const btn=e.currentTarget, card=btn.closest('[data-cms-id]'), id=card.dataset.cmsId;
    const payload={}; card.querySelectorAll('[data-field]').forEach(x=>payload[x.dataset.field]=x.value);
    btn.disabled=true;
    const {error}=await db.from('site_content').update(payload).eq('id',id);
    btn.disabled=false;
    const msg=card.querySelector('[data-msg]');
    if(error){msg.textContent=error.message;return;}
    msg.textContent='هاتە هەڵگرتن ✓';
    setTimeout(()=>{msg.textContent='';},1800);
  }

  function localizeAdmin(){
    const map={Dashboard:'سەرەکی',Products:'بەرهەم',Orders:'داواکاری',Customers:'کڕیار',Settings:'ڕێکخستن',Logout:'دەرکەفتن',Store:'ماڵپەڕ',Sales:'فرۆتن',Orders:'داواکاری',Products:'بەرهەم',Customers:'کڕیار',Latest:'دوماهی',New:'نوێ',Edit:'دەستکاری',Delete:'سڕینەوە'};
    document.querySelectorAll('aside button,.top button,.top a').forEach(el=>{const t=el.textContent.trim(); if(map[t])el.textContent=map[t];});
    const title=document.querySelector('#dashboard h1'); if(title)title.textContent='سەرەکی';
  }

  function boot(){
    inject(); localizeAdmin();
    const observer=new MutationObserver(()=>localizeAdmin()); observer.observe(document.body,{subtree:true,childList:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
