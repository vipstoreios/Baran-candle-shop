/* Baran Candle Shop — single storefront runtime. No legacy scripts, no patch chaining. */
(() => {
  'use strict';

  // Prevent browsers from restoring the previous scroll position on a real reload.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const isReload = nav?.type === 'reload';
  if (isReload) window.scrollTo(0, 0);

  const products = [
    {id:1,name:{badini:'Shîrîn Vanilla',sorani:'ڤانیلا شیرین',arabic:'فانيلا حلوة',english:'Sweet Vanilla'},cat:'scented',price:24,burn:'45h',wax:'Soy Wax',notes:'Vanilla · Amber · Musk'},
    {id:2,name:{badini:'Amber Oud',sorani:'عودی ئەمبەر',arabic:'عود وعنبر',english:'Amber Oud'},cat:'scented',price:29,burn:'50h',wax:'Soy Wax',notes:'Oud · Amber · Cedar'},
    {id:3,name:{badini:'Ivory Pillar',sorani:'ستونی ئیڤۆری',arabic:'شمعة عاجية',english:'Ivory Pillar'},cat:'decor',price:21,burn:'35h',wax:'Beeswax',notes:'Warm Linen · Vanilla'},
    {id:4,name:{badini:'Rose Atelier',sorani:'ئەتلیەی گوڵ',arabic:'وردة فاخرة',english:'Rose Atelier'},cat:'scented',price:26,burn:'40h',wax:'Soy Wax',notes:'Rose · Peony · Sandalwood'},
    {id:5,name:{badini:'Golden Duo',sorani:'دووانەی زێڕین',arabic:'ثنائي ذهبي',english:'Golden Duo'},cat:'gifts',price:42,burn:'40h each',wax:'Soy Wax',notes:'Amber · Fig · Vanilla'},
    {id:6,name:{badini:'Sandstone',sorani:'بەردی خۆڵەمێشی',arabic:'حجر رملي',english:'Sandstone'},cat:'decor',price:27,burn:'48h',wax:'Beeswax',notes:'Sandalwood · Tonka'},
    {id:7,name:{badini:'Fig & Cedar',sorani:'هەنجیر و سەدر',arabic:'تين وأرز',english:'Fig & Cedar'},cat:'scented',price:25,burn:'45h',wax:'Soy Wax',notes:'Fig · Cedar · Moss'},
    {id:8,name:{badini:'Baran Gift Box',sorani:'بۆکسێکی دیاری باران',arabic:'صندوق هدايا باران',english:'Baran Gift Box'},cat:'gifts',price:55,burn:'50h each',wax:'Soy Wax',notes:'Curated seasonal scents'}
  ];

  const dict = {
    badini:{announcement:'گەهاندنا خێرا بۆ هەمی ناڤچەیێن کوردستان ✦',navHome:'سەرەکی',navShop:'بەرهەم',navRitual:'ڕێوڕەسم',navStory:'چیرۆکا مە',navContact:'پەیوەندی',heroEyebrow:'ب دەست و خۆشەویستی',heroTitle:'رۆناهییەک بۆ<br><em>هەر ساتەکێ.</em>',heroText:'مۆمێن دەستکردێن پریمیۆم، بۆنێن ئارام و دیارییێن جوان ژ بو هەستەکێ تایبەت.',shopNow:'نیها بکڕە',categoriesTitle:'جیهانا بۆن و جوانیێ',catScented:'مۆمێن بۆنخۆش',catScentedSub:'مۆمێن بۆنخۆش',catDecor:'مۆمێن دیکۆر',catDecorSub:'مۆمێن دیکۆر و ستوونی',catGifts:'دیارییێن تایبەت',catGiftsSub:'کۆمەڵێن دیارییێن دەستکرد',ourCollection:'کۆکراوەیا مە',shopTitle:'بەرهەمێن هەڵبژێردی',viewAll:'هەمی ببینە ↗',search:'ل بەرهەمەکی بگەڕێ...',all:'هەمی',scented:'بۆنخۆش',decor:'دیکۆر',gifts:'دیاری',featured:'هەڵبژێردی',low:'نرخ: کەم بۆ زۆر',high:'نرخ: زۆر بۆ کەم',ourStory:'چیرۆکا باران',storyTitle:'ژ دڵێ هاتیە دروستکرن.<br><em>بۆ مالا تە.</em>',storyText:'هەر مۆمێکێ Baran ب دەست هاتیە دروستکرن، ب مومێکی باش و بۆنێکی هاوسەنگ. باوەری مە وایە تشتێن بچووک دکارن هەستێن مەزن دروست بکەن.',ritualTitle:'دەمێ مۆم دسوژیت،<br><em>دەم کەمەک راوەستیت.</em>',ritualText:'مۆمێکێ دابنێ، چرایان کەم بکە و بهێلە بۆنەکە مالا تە پڕ بکەت.',step1:'هەڵبژێرە',step2:'دائگرسێنە',step3:'هەست بکە',value1:'مومێکی پاک',value1p:'Soy Wax و Beeswax ب هەڵبژاردنەکا ورد.',value2:'بۆنەکا تایبەت',value2p:'بۆنێن هاوسەنگ بۆ هەستەکا قووڵتر.',value3:'پەکەجینگا جوان',value3p:'ئامادەیە بۆ تە یان کەسەکێ تە خۆش.',value4:'دروستکریا ناڤخۆ',value4p:'ب دەست دروستکری ل کوردستان.',newsletterTitle:'بەهارا بۆنێن خۆ ل دەست مەدە.',newsletterText:'ئیمەیڵا خۆ بنڤیسە بۆ کۆمەڵا نوی و ئۆفەرێن تایبەت.',email:'ئیمەیڵا تە',join:'بەشدار بە',yourCart:'سەبەتا تە',subtotal:'کۆی گشتی',checkout:'بۆ پارەدان',footer:'بۆن، رۆناهی، ئارامی.',ourStoryLink:'چیرۆکا مە بخوینە ↗',collectionBadge:'هەڵبژێردی · ٢٠٢٦',lightMoment:'رۆناهی بۆ ساتێ'},
    sorani:{announcement:'گەیاندنی خێرا بۆ هەموو ناوچەکانی کوردستان ✦',navHome:'سەرەکی',navShop:'بەرهەمەکان',navRitual:'ڕیتواڵ',navStory:'چیرۆکەکەمان',navContact:'پەیوەندی',heroEyebrow:'بە دەست و خۆشەویستی',heroTitle:'ڕووناکییەک بۆ<br><em>هەموو ساتێک.</em>',heroText:'مۆمی دەستکردی پریمیۆم، بۆنە هێمنەکان و دیارییە جوانەکان بۆ هەستێکی تایبەت.',shopNow:'ئێستا بکڕە',categoriesTitle:'جیهانی بۆن و جوانی',catScented:'مۆمی بۆنخۆش',catScentedSub:'مۆمی بۆنخۆش',catDecor:'مۆمی دیکۆر',catDecorSub:'مۆمی دیکۆر و ستوونی',catGifts:'دیارییە تایبەتەکان',catGiftsSub:'کۆمەڵەی دیارییە دەستکردەکان',ourCollection:'کۆمەڵەکەمان',shopTitle:'بەرهەمە هەڵبژێردراوەکان',viewAll:'هەمووی ببینە ↗',search:'بۆ بەرهەمێک بگەڕێ...',all:'هەموو',scented:'بۆنخۆش',decor:'دیکۆر',gifts:'دیاری',featured:'هەڵبژێردراو',low:'نرخ: کەم بۆ زۆر',high:'نرخ: زۆر بۆ کەم',ourStory:'چیرۆکی باران',storyTitle:'لە دڵەوە دروستکراوە.<br><em>بۆ ماڵەوەی تۆ.</em>',storyText:'هەر مۆمێکی Baran بە دەست دروست دەکرێت، بە مومێکی باش و بۆنی هاوسەنگ. باوەڕمان وایە شتە بچووکەکان دەتوانن هەستی گەورە دروست بکەن.',ritualTitle:'کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>',ritualText:'مۆمێک دابنێ، چرایەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.',step1:'هەڵیبژێرە',step2:'داگیرسێنە',step3:'هەست بکە',value1:'مومی پاک',value1p:'Soy Wax و Beeswax بە هەڵبژاردنی ورد.',value2:'بۆنی تایبەت',value2p:'بۆنە هاوسەنگەکان بۆ هەستی قووڵتر.',value3:'پەکەجینگی جوان',value3p:'ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.',value4:'دروستکراوی ناوخۆ',value4p:'بە دەست دروستکراو لە کوردستان.',newsletterTitle:'بەهاری بۆنەکانت لەدەست مەدە.',newsletterText:'ئیمەیڵەکەت بنووسە بۆ کۆمەڵە نوێکان و ئۆفەرە تایبەتەکان.',email:'ئیمەیڵەکەت',join:'بەشداری بکە',yourCart:'سەبەتەکەت',subtotal:'کۆی گشتی',checkout:'بڕۆ بۆ پارەدان',footer:'بۆن، ڕووناکی، ئارامی.',ourStoryLink:'چیرۆکەکەمان بخوێنەوە ↗',collectionBadge:'هەڵبژێردراو · ٢٠٢٦',lightMoment:'ڕووناکی بۆ ساتێک'},
    arabic:{announcement:'توصيل سريع إلى جميع أنحاء العراق ✦',navHome:'الرئيسية',navShop:'المنتجات',navRitual:'الطقس',navStory:'قصتنا',navContact:'تواصل معنا',heroEyebrow:'مصنوع بحب وعناية',heroTitle:'نورٌ لكل<br><em>لحظة.</em>',heroText:'شموع فاخرة مصنوعة يدوياً، بروائح هادئة وهدايا أنيقة تضيف لمسة استثنائية.',shopNow:'تسوق الآن',categoriesTitle:'عالم من العطر والجمال',catScented:'شموع معطرة',catScentedSub:'شموع معطرة',catDecor:'شموع للديكور',catDecorSub:'شموع ديكور وأعمدة',catGifts:'مجموعات هدايا',catGiftsSub:'مجموعات هدايا مصنوعة يدوياً',ourCollection:'مجموعتنا',shopTitle:'منتجات مختارة لك',viewAll:'عرض الكل ↗',search:'ابحث عن منتج...',all:'الكل',scented:'معطرة',decor:'ديكور',gifts:'هدايا',featured:'مميزة',low:'السعر: الأقل أولاً',high:'السعر: الأعلى أولاً',ourStory:'قصة باران',storyTitle:'مصنوعة من القلب.<br><em>لمنزلك.</em>',storyText:'كل شمعة من Baran مصنوعة يدوياً من شمع مختار بعناية وعطور متوازنة. نؤمن أن التفاصيل الصغيرة تصنع مشاعر كبيرة.',ritualTitle:'عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>',ritualText:'أشعل شمعة، خفّف الأضواء ودع العطر يملأ منزلك.',step1:'اخترها',step2:'أشعلها',step3:'استشعرها',value1:'شمع نقي',value1p:'شمع الصويا وشمع العسل باختيار دقيق.',value2:'عطر مميز',value2p:'نفحات متوازنة لشعور أعمق.',value3:'تغليف أنيق',value3p:'جاهز لك أو لمن تحب.',value4:'صناعة محلية',value4p:'مصنوع يدوياً في كردستان.',newsletterTitle:'لا تفوّت مواسم العطر.',newsletterText:'أدخل بريدك لمعرفة التشكيلات الجديدة والعروض الخاصة.',email:'بريدك الإلكتروني',join:'اشترك',yourCart:'سلة التسوق',subtotal:'المجموع',checkout:'إتمام الدفع',footer:'عطر، نور، وهدوء.',ourStoryLink:'اقرأ قصتنا ↗',collectionBadge:'مختارات · ٢٠٢٦',lightMoment:'نور لكل لحظة'},
    english:{announcement:'Fast delivery across Iraq & Kurdistan ✦',navHome:'Home',navShop:'Shop',navRitual:'Ritual',navStory:'Our Story',navContact:'Contact',heroEyebrow:'Made by hand, made with love',heroTitle:'A little light for<br><em>every moment.</em>',heroText:'Premium handmade candles, quiet fragrances and beautiful gifts designed to make everyday moments feel special.',shopNow:'Shop now',categoriesTitle:'A world of scent & beauty',catScented:'Scented Candles',catScentedSub:'Scented Candles',catDecor:'Decorative Candles',catDecorSub:'Decorative & Pillar Candles',catGifts:'Special Gift Sets',catGiftsSub:'Handmade Gift Sets',ourCollection:'Our collection',shopTitle:'The selected pieces',viewAll:'View all ↗',search:'Search products...',all:'All',scented:'Scented',decor:'Decor',gifts:'Gifts',featured:'Featured',low:'Price: low to high',high:'Price: high to low',ourStory:'The Baran story',storyTitle:'Made from the heart.<br><em>For your home.</em>',storyText:'Every Baran candle is hand-poured with carefully selected wax and balanced fragrance. We believe small details can create big feelings.',ritualTitle:'When a candle burns,<br><em>time slows down.</em>',ritualText:'Light a candle, dim the lights and let the fragrance fill your home.',step1:'Choose',step2:'Light',step3:'Feel',value1:'Pure wax',value1p:'Soy Wax and Beeswax, carefully selected.',value2:'Signature scent',value2p:'Balanced notes for a deeper feeling.',value3:'Beautiful packaging',value3p:'Ready for you or someone you love.',value4:'Locally made',value4p:'Hand-poured in Kurdistan.',newsletterTitle:'Never miss a season of scent.',newsletterText:'Join our notes for new collections and private offers.',email:'Your email',join:'Join us',yourCart:'Your cart',subtotal:'Subtotal',checkout:'Checkout',footer:'Scent, light, serenity.',ourStoryLink:'Read our story ↗',collectionBadge:'CURATED · 2026',lightMoment:'Light the moment'}
  };

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  let lang = localStorage.getItem('baran-language') || 'badini';
  if (!dict[lang]) lang = 'badini';
  let filter = 'all';
  let cart = JSON.parse(localStorage.getItem('baran-cart') || '[]');

  function saveCart(){ localStorage.setItem('baran-cart', JSON.stringify(cart)); }
  function text(key){ return dict[lang][key] ?? dict.english[key] ?? key; }
  function setLanguage(value){
    if (!dict[value]) return;
    lang = value;
    localStorage.setItem('baran-language', lang);
    document.documentElement.lang = lang === 'english' ? 'en' : lang === 'arabic' ? 'ar' : 'ku';
    document.documentElement.dir = lang === 'english' ? 'ltr' : 'rtl';
    const select = $('#language'); if(select) select.value = lang;
    $$('[data-i18n]').forEach(el => { const key=el.dataset.i18n; if(dict[lang][key]!==undefined) el.innerHTML=dict[lang][key]; });
    $$('[data-i18n-placeholder]').forEach(el => { const key=el.dataset.i18nPlaceholder; if(dict[lang][key]!==undefined) el.placeholder=dict[lang][key]; });
    renderProducts(); renderCart();
  }

  function renderProducts(){
    const grid=$('#productGrid'); if(!grid)return;
    const q=($('#search')?.value || '').trim().toLocaleLowerCase();
    let list=products.filter(p=>filter==='all'||p.cat===filter).filter(p=>!q||Object.values(p.name).some(n=>n.toLocaleLowerCase().includes(q)));
    const sort=$('#sort')?.value || 'featured';
    if(sort==='low') list.sort((a,b)=>a.price-b.price); else if(sort==='high') list.sort((a,b)=>b.price-a.price);
    grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-img"><div class="mini-candle"></div></div><div class="product-info"><h3>${escapeHtml(p.name[lang])}</h3><div class="product-meta">${escapeHtml(p.wax)} · ${escapeHtml(p.burn)} · ${escapeHtml(p.notes)}</div><div class="product-bottom"><strong>$${p.price.toFixed(2)}</strong><button class="add-btn" data-add="${p.id}">+</button></div></div></article>`).join('') || '<p class="empty-state">No products found.</p>';
  }

  function renderCart(){
    const count=cart.reduce((n,i)=>n+i.qty,0), countEl=$('#cartCount'); if(countEl)countEl.textContent=count;
    const box=$('#cartItems'); if(!box)return;
    box.innerHTML=cart.length?cart.map(i=>{const p=products.find(x=>x.id===i.id);return p?`<div class="cart-row"><div><b>${escapeHtml(p.name[lang])}</b><small>$${p.price.toFixed(2)} × ${i.qty}</small></div><div><button class="small-cart" data-dec="${p.id}">−</button><button class="small-cart" data-inc="${p.id}">+</button></div></div>`:''}).join(''):`<div class="empty-cart">${lang==='english'?'Your cart is empty.':lang==='arabic'?'السلة فارغة.':'سەبەتەکەت بەتاڵە.'}</div>`;
    const total=cart.reduce((sum,i)=>{const p=products.find(x=>x.id===i.id);return sum+(p?p.price*i.qty:0)},0);
    const totalEl=$('#cartTotal');if(totalEl)totalEl.textContent=`$${total.toFixed(2)}`;
  }

  function escapeHtml(v){return String(v??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
  function add(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();renderCart();openCart();}
  function change(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();renderCart();}
  function openCart(){ $('#cartDrawer')?.classList.add('open'); $('#overlay')?.classList.add('show'); }
  function closeCart(){ $('#cartDrawer')?.classList.remove('open'); $('#overlay')?.classList.remove('show'); }

  document.addEventListener('click',e=>{
    const addBtn=e.target.closest('[data-add]');if(addBtn){add(Number(addBtn.dataset.add));return;}
    const inc=e.target.closest('[data-inc]');if(inc){change(Number(inc.dataset.inc),1);return;}
    const dec=e.target.closest('[data-dec]');if(dec){change(Number(dec.dataset.dec),-1);return;}
    const filterBtn=e.target.closest('.filter');if(filterBtn){filter=filterBtn.dataset.filter||'all';$$('.filter').forEach(x=>x.classList.toggle('active',x===filterBtn));renderProducts();return;}
    const cat=e.target.closest('[data-filter]');if(cat && cat.classList.contains('category')){filter=cat.dataset.filter||'all';$$('.filter').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));return;}
  });

  function init(){
    const language=$('#language');if(language)language.value=lang,language.addEventListener('change',e=>setLanguage(e.target.value));
    $('#search')?.addEventListener('input',renderProducts);$('#sort')?.addEventListener('change',renderProducts);
    $('#cartButton')?.addEventListener('click',openCart);$('#closeCart')?.addEventListener('click',closeCart);$('#overlay')?.addEventListener('click',closeCart);
    $('#menuBtn')?.addEventListener('click',()=>$('#mobileNav')?.classList.toggle('open'));
    $('#mobileNav')?.addEventListener('click',()=>$('#mobileNav')?.classList.remove('open'));
    $('#searchTrigger')?.addEventListener('click',()=>{document.querySelector('#shop')?.scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#search')?.focus(),400)});
    $('#newsletter')?.addEventListener('submit',e=>{e.preventDefault();const toast=$('#toast');if(toast){toast.textContent=lang==='english'?'Thank you for joining Baran.':'سوپاس بۆ بەشداریکردن لە Baran.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}});
    $('#checkout')?.addEventListener('click',()=>{if(!cart.length)return;location.href='checkout.html';});
    setLanguage(lang);
    if(isReload){[0,50,150].forEach(t=>setTimeout(()=>window.scrollTo(0,0),t));}
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();