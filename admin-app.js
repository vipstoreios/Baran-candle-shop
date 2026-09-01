(() => {
  'use strict';
  const db = window.supabase.createClient(window.BARAN_SUPABASE_URL, window.BARAN_SUPABASE_KEY);
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
  let products=[], orders=[], customers=[], categories=[], scents=[], editingId=null;

  const showLogin = (message='') => { $('#auth').classList.remove('hidden'); $('#app').classList.add('hidden'); $('#authMsg').textContent=message; };
  const showApp = session => { $('#auth').classList.add('hidden'); $('#app').classList.remove('hidden'); $('#adminEmail').textContent=session?.user?.email||''; };

  async function verifyAdmin(session){
    if(!session) return {ok:false,message:''};
    const {data,error}=await db.from('admin_profiles').select('id,active,role').eq('id',session.user.id).eq('active',true).maybeSingle();
    if(error) return {ok:false,message:'نەگەهشتین ب ئەدمین پانێلێ. رێکخستنێن ئەدمین پشکنینە.'};
    if(!data) return {ok:false,message:'ئەڤ هەژمارە ئەدمینێ چالاک نینە.'};
    return {ok:true};
  }

  async function login(e){
    e.preventDefault();
    const email=$('#email').value.trim().toLowerCase(), password=$('#password').value, msg=$('#authMsg'), btn=$('#loginBtn');
    msg.textContent='چوونەژوورەوە...'; btn.disabled=true;
    try{
      const {data,error}=await db.auth.signInWithPassword({email,password});
      if(error){msg.textContent=error.message||'چوونەژوورەوە نەسەرکەوت.';return;}
      const check=await verifyAdmin(data.session);
      if(!check.ok){msg.textContent=check.message;return;}
      showApp(data.session); await loadAll(); await loadSettings();
    }catch(err){console.error(err);msg.textContent=err.message||'نەگەهشتین ب پانێلێ.';}
    finally{btn.disabled=false;}
  }

  async function restore(){
    const {data}=await db.auth.getSession();
    if(!data.session){showLogin('');return;}
    const check=await verifyAdmin(data.session);
    if(!check.ok){await db.auth.signOut();showLogin(check.message);return;}
    showApp(data.session); await loadAll(); await loadSettings();
  }

  async function loadAll(){
    // These selects intentionally match the supplied Supabase schema. In particular,
    // scents has no name_english column, so requesting it previously broke the load.
    const [p,o,c,cat,sc]=await Promise.all([
      db.from('products').select('*,categories(name_badini,name_sorani,name_arabic,name_english),scents(id,name_badini,name_sorani,name_arabic)').order('created_at',{ascending:false}),
      db.from('orders').select('*').order('created_at',{ascending:false}),
      db.from('customers').select('*').order('created_at',{ascending:false}),
      db.from('categories').select('*').order('sort_order'),
      db.from('scents').select('id,name_badini,name_sorani,name_arabic').order('name_badini')
    ]);
    if(p.error)console.error('Products:',p.error);
    if(o.error)console.error('Orders:',o.error);
    if(c.error)console.error('Customers:',c.error);
    if(cat.error)console.error('Categories:',cat.error);
    if(sc.error)console.error('Scents:',sc.error);
    products=p.data||[]; orders=o.data||[]; customers=c.data||[]; categories=cat.data||[]; scents=sc.data||[];
    $('#productCount').textContent=products.length;
    $('#orderCount').textContent=orders.length;
    $('#customerCount').textContent=customers.length;
    $('#salesTotal').textContent=orders.filter(x=>x.status!=='cancelled').reduce((a,x)=>a+Number(x.total||0),0).toFixed(2)+' USD';
    renderProducts(); renderOrders(); renderCustomers(); renderDashboard(); fillSelects();
  }

  function renderDashboard(){
    $('#dashOrders').innerHTML=orders.slice(0,8).map(o=>`<tr><td>${esc(o.order_number)}</td><td>${esc(o.customer_name)}</td><td>${Number(o.total||0).toFixed(2)} ${esc(o.currency||'USD')}</td><td>${esc(o.status||'pending')}</td></tr>`).join('')||'<tr><td colspan="4">هیچ داواکارییەک نییە.</td></tr>';
  }

  function renderProducts(){
    $('#productsBody').innerHTML=products.map(p=>`<tr><td><div class="prod">${p.image_url?`<img src="${esc(p.image_url)}" onerror="this.style.display='none'">`:''}<span>${esc(p.name_badini||p.name_english||'—')}</span></div></td><td>${esc(p.categories?.name_badini||'—')}</td><td>${Number(p.price||0).toFixed(2)}</td><td>${p.stock??0}</td><td>${p.active?'چالاک':'شاراوە'}</td><td><button class="small" data-edit="${p.id}">دەستکاری</button><button class="small danger" data-delete="${p.id}">سڕینەوە</button></td></tr>`).join('')||'<tr><td colspan="6">هیچ بەرهەمێک نییە.</td></tr>';
  }

  function renderOrders(){
    const statuses=['pending','confirmed','preparing','shipped','delivered','cancelled'];
    $('#ordersBody').innerHTML=orders.map(o=>`<tr><td>${esc(o.order_number)}<small>${o.created_at?new Date(o.created_at).toLocaleString('ku-IQ'):''}</small></td><td>${esc(o.customer_name)}<small>${esc(o.customer_phone)}</small></td><td>${Number(o.total||0).toFixed(2)} ${esc(o.currency||'USD')}</td><td><select data-status="${o.id}">${statuses.map(s=>`<option value="${s}" ${s===o.status?'selected':''}>${esc(s)}</option>`).join('')}</select></td><td><button class="small" data-view="${o.id}">بینین</button></td></tr>`).join('')||'<tr><td colspan="5">هیچ داواکارییەک نییە.</td></tr>';
  }

  function renderCustomers(){
    $('#customersBody').innerHTML=customers.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.phone)}</td><td>${esc(c.email||'—')}</td><td>${esc([c.city,c.governorate].filter(Boolean).join(', ')||'—')}</td></tr>`).join('')||'<tr><td colspan="4">هیچ کڕیارێک نییە.</td></tr>';
  }

  function renderTab(id){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===id));document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x.dataset.tab===id));}

  function fillSelects(){
    $('#pCategory').innerHTML=categories.map(c=>`<option value="${c.id}">${esc(c.name_badini||c.name_english||'—')}</option>`).join('');
    $('#pScent').innerHTML='<option value="">بێ بۆن</option>'+scents.map(s=>`<option value="${s.id}">${esc(s.name_badini||'—')}</option>`).join('');
  }

  const fields={slug:'pSlug',name_english:'pNameEnglish',name_badini:'pNameBadini',name_sorani:'pNameSorani',name_arabic:'pNameArabic',description_english:'pDescEnglish',description_badini:'pDescBadini',description_sorani:'pDescSorani',description_arabic:'pDescArabic',wax_type:'pWaxType',burn_time_minutes:'pBurnTime',weight_grams:'pWeight',price:'pPrice',stock:'pStock',image_url:'pImage'};

  function openProduct(id=null){
    editingId=id; const p=products.find(x=>x.id===id); $('#productForm').reset(); fillSelects(); $('#productTitle').textContent=p?'دەستکاریکرنا بەرهەم':'بەرهەمی نوێ'; $('#pActive').checked=p?p.active!==false:true;
    if(p){Object.entries(fields).forEach(([k,id2])=>{const el=$('#'+id2);if(el)el.value=p[k]??''});$('#pCategory').value=p.category_id||'';$('#pScent').value=p.scent_id||'';$('#pFeatured').checked=!!p.featured;$('#pNew').checked=!!p.new_arrival;$('#pBest').checked=!!p.bestseller;}
    $('#formError').textContent=''; $('#productModal').classList.add('open');
  }

  async function saveProduct(e){
    e.preventDefault(); const v=id=>$('#'+id)?.value||null;
    const data={slug:v('pSlug'),name_english:v('pNameEnglish'),name_badini:v('pNameBadini'),name_sorani:v('pNameSorani'),name_arabic:v('pNameArabic'),description_english:v('pDescEnglish'),description_badini:v('pDescBadini'),description_sorani:v('pDescSorani'),description_arabic:v('pDescArabic'),category_id:v('pCategory')||null,scent_id:v('pScent')||null,wax_type:v('pWaxType'),burn_time_minutes:Number(v('pBurnTime')||0)||null,weight_grams:Number(v('pWeight')||0)||null,price:Number(v('pPrice')||0),stock:Number(v('pStock')||0),image_url:v('pImage'),featured:$('#pFeatured').checked,new_arrival:$('#pNew').checked,bestseller:$('#pBest').checked,active:$('#pActive').checked};
    const q=editingId?db.from('products').update(data).eq('id',editingId):db.from('products').insert(data); const{error}=await q; if(error){$('#formError').textContent=error.message;return;} $('#productModal').classList.remove('open'); await loadAll();
  }

  async function setStatus(id,status){
    const patch={status}; if(status==='confirmed')patch.confirmed_at=new Date().toISOString(); if(status==='shipped')patch.shipped_at=new Date().toISOString(); if(status==='delivered')patch.delivered_at=new Date().toISOString();
    const{error}=await db.from('orders').update(patch).eq('id',id); if(error)alert(error.message); else loadAll();
  }

  async function deleteProduct(id){if(!confirm('ئەم بەرهەمە بسڕینەوە؟'))return;const{error}=await db.from('products').delete().eq('id',id);if(error)alert(error.message);else loadAll();}

  async function loadSettings(){
    // The supplied schema does not contain a settings table. Ignore this optional section safely.
    const{data,error}=await db.from('settings').select('*').limit(1).maybeSingle();
    if(error){console.info('settings is optional/not present:',error.message);return;} if(!data)return;
    const map={site_name:'sName',phone:'sPhone',email:'sEmail',address:'sAddress',currency:'sCurrency',delivery_fee:'sDelivery',free_delivery_minimum:'sFree',whatsapp_number:'sWhatsapp',instagram_url:'sInstagram',facebook_url:'sFacebook',tiktok_url:'sTiktok'};
    Object.entries(map).forEach(([k,id])=>{if($('#'+id))$('#'+id).value=data[k]??''});
  }

  async function saveSettings(e){
    e.preventDefault();
    const data={site_name:$('#sName').value,phone:$('#sPhone').value,email:$('#sEmail').value,address:$('#sAddress').value,currency:$('#sCurrency').value,delivery_fee:Number($('#sDelivery').value||0),free_delivery_minimum:Number($('#sFree').value||0)||null,whatsapp_number:$('#sWhatsapp').value,instagram_url:$('#sInstagram').value,facebook_url:$('#sFacebook').value,tiktok_url:$('#sTiktok').value};
    const{data:old}=await db.from('settings').select('id').limit(1).maybeSingle(); const r=old?await db.from('settings').update(data).eq('id',old.id):await db.from('settings').insert(data); if(r.error)alert(r.error.message);else alert('ڕێکخستن هاتە هەڵگرتن.');
  }

  function wire(){
    $('#loginForm').addEventListener('submit',login);
    $('#logout').addEventListener('click',async()=>{await db.auth.signOut();showLogin('');});
    document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>renderTab(b.dataset.tab)));
    $('#dashNewProduct').addEventListener('click',()=>openProduct()); $('#productsNewProduct').addEventListener('click',()=>openProduct());
    $('#closeModal').addEventListener('click',()=>$('#productModal').classList.remove('open'));
    $('#productForm').addEventListener('submit',saveProduct); $('#saveSettings').addEventListener('submit',saveSettings);
    document.addEventListener('click',e=>{
      if(e.target.dataset.edit)openProduct(e.target.dataset.edit);
      if(e.target.dataset.delete)deleteProduct(e.target.dataset.delete);
      if(e.target.dataset.view){const o=orders.find(x=>x.id===e.target.dataset.view);if(o)alert(`داواکاری ${o.order_number}\nکڕیار: ${o.customer_name}\nژمارە: ${o.customer_phone}\nناونیشان: ${o.address||'—'}\nکۆی گشتی: ${o.total} ${o.currency||'USD'}\nدۆخ: ${o.status}`);}
    });
    document.addEventListener('change',e=>{if(e.target.dataset.status)setStatus(e.target.dataset.status,e.target.value);});
  }

  function start(){wire();restore();db.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')showLogin('');});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();