/* Baran storefront runtime — stable language + refresh behavior. */
(function(){
  'use strict';
  const LEGACY='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/da4795c863aacd087405c229bb51df472f9c57f8/script.js';

  // Browser scroll restoration was causing refresh to reopen at the previous scroll position.
  function resetScroll(){
    try{ history.scrollRestoration='manual'; }catch(e){}
    window.scrollTo({top:0,left:0,behavior:'instant'});
    document.documentElement.scrollTop=0;
    document.body.scrollTop=0;
  }
  const isReload=()=>{try{return performance.getEntriesByType('navigation')[0]?.type==='reload'}catch(e){return false}};
  if(isReload()){
    resetScroll();
    [0,20,80,200,500].forEach(t=>setTimeout(resetScroll,t));
  }
  window.addEventListener('pageshow',()=>{if(isReload())resetScroll()},{passive:true});

  const translations={
    badini:{
      navRitual:'Ritual',introLabel:'Cîhanek biçûk bo hestek mezin',introTitle:'Mûm ne tenê ye.<br><em>Ronahiya jiyanê ye.</em>',introText:'Her parçe bi dest tê çêkirin, bi bînekê ku bîranîn çêdike û şêweyek ku li mala te bi xweşî dijî.',
      ritualTitle:'Dema mûm dişewite,<br><em>demek hinek raweste.</em>',ritualText:'Mûmek vêxîne, ronahiyê kêm bike û bihêle bîn mala te tijî bike.',step1:'Hilbijêre',step2:'Vêxîne',step3:'Hest bike',
      value1:'Mûma paqij',value1p:'Soy Wax û Beeswax bi hilbijartineke baldar.',value2:'Bînên taybet',value2p:'Bînên hevseng ji bo hestek kûrtir.',value3:'Paketkirina xweş',value3p:'Amade ye ji bo te an kesek ku tu hez dikî.',value4:'Çêkirina herêmî',value4p:'Bi dest li Kurdistanê hatiye çêkirin.',
      catScentedSub:'Mûmên bînxweş',catDecorSub:'Mûmên dekorasyon û pillar',catGiftsSub:'Setên diyariyên destçêkirî'
    },
    sorani:{
      navRitual:'ڕیتواڵ',introLabel:'جیهانێکی بچووک بۆ هەستێکی گەورە',introTitle:'مۆم نییە تەنها.<br><em>ڕووناکییەکی ژیانە.</em>',introText:'هەر دانەیەک بە دەست دروست دەکرێت، بە بۆنێک کە بیرەوەری دروست دەکات و شێوەیەک کە بە جوانی لە ماڵەکەتدا دەژیت.',
      ritualTitle:'کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>',ritualText:'مۆمێک دابنێ، چراغەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.',step1:'هەڵیبژێرە',step2:'داگیرسێنە',step3:'هەست بکە',
      value1:'مومی پاک',value1p:'Soy Wax و Beeswax بە هەڵبژاردنی ورد.',value2:'بۆنی تایبەت',value2p:'بۆنی هاوسەنگ بۆ هەستی قووڵتر.',value3:'پەکەجینگێکی جوان',value3p:'ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.',value4:'دروستکراوی ناوخۆ',value4p:'دروستکراو بە دەست لە کوردستان.',
      catScentedSub:'مۆمی بۆنخۆش',catDecorSub:'مۆمی دیکۆر و ستوونی',catGiftsSub:'کۆمەڵەی دیاریی دەستکرد'
    },
    arabic:{
      navRitual:'الطقوس',introLabel:'عالم صغير لإحساس كبير',introTitle:'ليست شمعة فقط.<br><em>إنها ضوء للحياة.</em>',introText:'كل قطعة مصنوعة يدوياً، بعطر يصنع ذكرى وشكل يعيش بأناقة في منزلك.',
      ritualTitle:'عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>',ritualText:'أشعل شمعة، خفّف الإضاءة ودع العطر يملأ منزلك.',step1:'اخترها',step2:'أشعلها',step3:'استمتع',
      value1:'شمع نقي',value1p:'شمع الصويا وشمع العسل باختيار دقيق.',value2:'عطور خاصة',value2p:'روائح متوازنة لإحساس أعمق.',value3:'تغليف أنيق',value3p:'جاهز لك أو لمن تحب.',value4:'صناعة محلية',value4p:'مصنوع يدوياً في كردستان.',
      catScentedSub:'شموع معطرة',catDecorSub:'شموع للديكور والأعمدة',catGiftsSub:'مجموعات هدايا مصنوعة يدوياً'
    },
    english:{
      navRitual:'Ritual',introLabel:'A small world for a bigger feeling',introTitle:'More than a candle.<br><em>A little light for life.</em>',introText:'Every piece is hand-poured with a scent that creates a memory and a form that lives beautifully in your home.',
      ritualTitle:'When a candle burns,<br><em>time slows down.</em>',ritualText:'Light a candle, soften the lights and let the fragrance fill your home.',step1:'Choose',step2:'Light',step3:'Feel',
      value1:'Clean wax',value1p:'Soy Wax and Beeswax, carefully selected.',value2:'Signature scents',value2p:'Balanced notes for a deeper feeling.',value3:'Beautiful packaging',value3p:'Ready for you or someone you love.',value4:'Locally made',value4p:'Hand-poured in Kurdistan.',
      catScentedSub:'Scented Candles',catDecorSub:'Decorative & Pillar Candles',catGiftsSub:'Handmade Gift Sets'
    }
  };

  function setDirection(code){
    document.documentElement.dir=code==='english'?'ltr':'rtl';
    document.documentElement.lang=code==='english'?'en':code==='arabic'?'ar':'ku';
  }
  function applyExtras(code){
    const d=translations[code];if(!d)return;
    setDirection(code);
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key=el.dataset.i18n;
      if(d[key]!==undefined)el.innerHTML=d[key];
    });
    const map={scented:'catScentedSub',decor:'catDecorSub',gifts:'catGiftsSub'};
    Object.keys(map).forEach(cat=>{
      document.querySelectorAll(`[data-filter="${cat}"] small`).forEach(el=>el.textContent=d[map[cat]]);
    });
  }
  function currentCode(){return document.querySelector('#language')?.value||'badini'}

  function installLanguage(){
    const select=document.querySelector('#language');if(!select)return;
    const apply=()=>{
      const code=select.value;
      try{if(typeof lang!=='undefined')lang=code}catch(e){}
      try{if(typeof renderText==='function')renderText()}catch(e){}
      // renderText belongs to the legacy storefront. Apply our missing keys after it finishes.
      applyExtras(code);
      requestAnimationFrame(()=>applyExtras(code));
      try{localStorage.setItem('baran-language',code)}catch(e){}
    };
    const saved=(()=>{try{return localStorage.getItem('baran-language')}catch(e){return null}})();
    if(saved&&['badini','sorani','arabic','english'].includes(saved))select.value=saved;
    select.addEventListener('change',apply);
    apply();
  }

  function loadLegacy(){
    return new Promise((resolve,reject)=>{
      if(window.__baranLegacyLoaded)return resolve();
      const s=document.createElement('script');s.src=LEGACY;s.onload=()=>{window.__baranLegacyLoaded=true;resolve()};s.onerror=reject;document.head.appendChild(s);
    });
  }

  loadLegacy().then(()=>{
    installLanguage();
    // Legacy navigation must keep working; only prevent automatic hash jumps on a true reload.
    if(!isReload() && location.hash){
      // Keep normal in-page links usable when the user intentionally opens an anchor.
    }
  }).catch(err=>console.error('Baran storefront runtime failed:',err));
})();