/* BARAN LIVE STORE — Supabase-backed storefront enhancement */
(() => {
  const start = async () => {
    if (!window.supabase || !window.BARAN_SUPABASE_URL || !window.BARAN_SUPABASE_KEY) return;
    const db = window.supabase.createClient(window.BARAN_SUPABASE_URL, window.BARAN_SUPABASE_KEY);
    window.baranDB = db;
    let liveProducts = [];
    let liveCart = JSON.parse(localStorage.getItem('baran_cart') || '[]');

    const esc = s => String(s ?? '').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
    const currentLang = () => window.lang || document.querySelector('#language')?.value || 'badini';
    const nameOf = p => p[`name_${currentLang()}`] || p.name_english || p.name_badini || '';
    const catName = p => p.categories?.[`name_${currentLang()}`] || '';
    const money = n => `${Number(n || 0).toFixed(2)} USD`;

    async function loadProducts() {
      const { data, error } = await db.from('products').select('*, categories(*), scents(*)').eq('active', true).order('featured', {ascending:false}).order('created_at', {ascending:false});
      if (error) { console.warn('Baran products:', error.message); return; }
      liveProducts = data || [];
      renderLiveProducts();
    }

    function renderLiveProducts() {
      const grid = document.querySelector('#productGrid');
      if (!grid) return;
      const q = (document.querySelector('#search')?.value || '').trim().toLowerCase();
      const f = window.filter || 'all';
      let arr = liveProducts.filter(p => (f === 'all' || p.categories?.slug === f) && (!q || [p.name_badini,p.name_sorani,p.name_arabic,p.name_english].some(x => (x||'').toLowerCase().includes(q))));
      const sort = document.querySelector('#sort')?.value;
      if (sort === 'low') arr.sort((a,b)=>Number(a.price)-Number(b.price));
      if (sort === 'high') arr.sort((a,b)=>Number(b.price)-Number(a.price));
      grid.innerHTML = arr.map(p => `<article class="product-card live-product" data-id="${p.id}">
        <div class="product-img" style="${p.image_url ? `background-image:url('${esc(p.image_url)}');background-size:cover;background-position:center` : ''}">
          ${!p.image_url ? '<div class="mini-candle"></div>' : ''}
          ${p.new_arrival ? '<span style="position:absolute;top:14px;right:14px;background:#29241f;color:#fff;padding:7px 10px;font-size:8px;z-index:3">NEW</span>' : ''}
        </div>
        <div class="product-info"><h3>${esc(nameOf(p))}</h3><div class="product-meta">${esc(p.wax_type || '')} · ${p.burn_time_minutes ? Math.round(p.burn_time_minutes/60)+'h' : ''} · ${esc(p.scents?.name_english || '')}</div><div class="product-bottom"><strong class="price">${money(p.price)}</strong><button class="add live-add" data-id="${p.id}" aria-label="Add to cart">+</button></div></div>
      </article>`).join('') || '<p style="grid-column:1/-1;padding:30px;text-align:center">No products found.</p>';
    }

    function saveCart() { localStorage.setItem('baran_cart', JSON.stringify(liveCart)); renderCart(); }
    function renderCart() {
      const box = document.querySelector('#cartItems'); if (!box) return;
      let total = 0, count = 0;
      box.innerHTML = liveCart.map(i => { const p = liveProducts.find(x=>x.id===i.id) || i.product; const qty=i.qty; const line=Number(p.price)*qty; total+=line; count+=qty; return `<div style="display:flex;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid #eee"><div style="width:58px;height:68px;background:#e8ded0 url('${esc(p.image_url||'')}') center/cover no-repeat;display:grid;place-items:center">${p.image_url?'':'🕯️'}</div><div style="flex:1"><strong>${esc(nameOf(p))}</strong><small style="display:block;color:#8e7d6c;margin-top:4px">${money(p.price)} × ${qty}</small><button data-remove="${p.id}" style="border:0;background:none;padding:6px 0;color:#9b6b55;cursor:pointer">Remove</button></div><b>${money(line)}</b></div>`; }).join('') || '<div style="padding:40px 0;text-align:center;color:#8e7d6c">Your cart is empty.</div>';
      const totalEl=document.querySelector('#cartTotal'); if(totalEl) totalEl.textContent=money(total);
      const c=document.querySelector('#cartCount'); if(c) c.textContent=count;
    }

    document.addEventListener('click', e => {
      const add=e.target.closest('.live-add');
      if(add){ const p=liveProducts.find(x=>x.id===add.dataset.id); if(!p)return; const old=liveCart.find(x=>x.id===p.id); old?old.qty++:liveCart.push({id:p.id,qty:1,product:p}); saveCart(); document.querySelector('#cartDrawer')?.classList.add('open'); document.querySelector('#overlay')?.classList.add('open'); return; }
      const rm=e.target.closest('[data-remove]');
      if(rm){liveCart=liveCart.filter(x=>x.id!==rm.dataset.remove);saveCart();}
    });

    document.querySelector('#checkout')?.addEventListener('click', openCheckout);

    function openCheckout(){
      if(!liveCart.length){alert('Your cart is empty');return;}
      const old=document.querySelector('#baranCheckout'); old?.remove();
      const modal=document.createElement('div'); modal.id='baranCheckout'; modal.style.cssText='position:fixed;inset:0;z-index:120;background:#29241fee;display:grid;place-items:center;padding:18px;overflow:auto';
      modal.innerHTML=`<div style="background:#fcfaf6;width:min(680px,100%);padding:32px;max-height:94vh;overflow:auto"><div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #ded5c8;padding-bottom:18px"><div><small style="color:#b89a63;letter-spacing:.18em">BARAN CANDLE ATELIER</small><h2 style="font:400 38px Amiri;margin:5px 0">Checkout</h2></div><button id="closeCheckout" style="border:0;background:none;font-size:28px;cursor:pointer">×</button></div><form id="baranOrderForm" style="display:grid;gap:13px;margin-top:22px"><input required name="name" placeholder="Full name" style="padding:14px;border:1px solid #ded5c8;background:white"><input required name="phone" placeholder="Phone number" style="padding:14px;border:1px solid #ded5c8;background:white"><input type="email" name="email" placeholder="Email (optional)" style="padding:14px;border:1px solid #ded5c8;background:white"><input name="governorate" placeholder="Governorate" style="padding:14px;border:1px solid #ded5c8;background:white"><input name="city" placeholder="City" style="padding:14px;border:1px solid #ded5c8;background:white"><textarea required name="address" placeholder="Full delivery address" style="padding:14px;border:1px solid #ded5c8;background:white;min-height:90px"></textarea><textarea name="notes" placeholder="Order notes / gift message (optional)" style="padding:14px;border:1px solid #ded5c8;background:white;min-height:70px"></textarea><div id="orderSummary" style="background:#eee5d7;padding:16px;font-size:12px"></div><button class="btn primary" style="padding:17px" type="submit">Place order</button><p id="orderResult" style="font-size:12px"></p></form></div>`;
      document.body.appendChild(modal); document.querySelector('#closeCheckout').onclick=()=>modal.remove();
      let total=0; document.querySelector('#orderSummary').innerHTML=liveCart.map(i=>{const p=liveProducts.find(x=>x.id===i.id)||i.product;const v=Number(p.price)*i.qty;total+=v;return `<div style="display:flex;justify-content:space-between;padding:4px 0"><span>${esc(nameOf(p))} × ${i.qty}</span><b>${money(v)}</b></div>`}).join('')+`<hr><div style="display:flex;justify-content:space-between"><b>Total</b><b>${money(total)}</b></div>`;
      document.querySelector('#baranOrderForm').onsubmit=async ev=>{ev.preventDefault();const f=new FormData(ev.target);const result=document.querySelector('#orderResult');result.textContent='Sending order…';
        const customer={name:f.get('name'),phone:f.get('phone'),email:f.get('email')||null,governorate:f.get('governorate')||null,city:f.get('city')||null,address:f.get('address'),notes:f.get('notes')||null};
        let {data:c,error:ce}=await db.from('customers').insert(customer).select().single(); if(ce){result.textContent='Could not create customer. Please try again.';console.error(ce);return;}
        const {data:o,error:oe}=await db.from('orders').insert({customer_id:c.id,customer_name:c.name,customer_phone:c.phone,customer_email:c.email,governorate:c.governorate,city:c.city,address:c.address,customer_notes:c.notes,subtotal:total,total:total,currency:'USD'}).select().single(); if(oe){result.textContent='Could not create order. Please try again.';console.error(oe);return;}
        const items=liveCart.map(i=>{const p=liveProducts.find(x=>x.id===i.id)||i.product;return {order_id:o.id,product_id:p.id,product_name:nameOf(p),scent_name:p.scents?.name_english||null,quantity:i.qty,unit_price:p.price,total_price:Number(p.price)*i.qty};});
        const {error:ie}=await db.from('order_items').insert(items); if(ie){result.textContent='Order created but items could not be saved.';console.error(ie);return;}
        liveCart=[];saveCart();result.innerHTML=`<strong>Order ${esc(o.order_number)} received.</strong><br>We will contact you on ${esc(c.phone)} to confirm your order.`;ev.target.querySelector('button[type=submit]').disabled=true;
      };
    }

    // Replace static product rendering with live Supabase data after initial page boot.
    const langEl=document.querySelector('#language'); langEl?.addEventListener('change',()=>setTimeout(renderLiveProducts,20));
    document.querySelector('#search')?.addEventListener('input',renderLiveProducts);
    document.querySelector('#sort')?.addEventListener('change',renderLiveProducts);
    document.addEventListener('click',e=>{const f=e.target.closest('.filter');if(f){setTimeout(renderLiveProducts,30);}});
    document.querySelector('#cartButton')?.addEventListener('click',()=>renderCart());
    await loadProducts(); renderCart();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
