/* Baran runtime loader — hardened boot, language and interaction safeguards. */
(function(){
  const legacy='https://raw.githubusercontent.com/vipstoreios/Baran-candle-shop/da4795c863aacd087405c229bb51df472f9c57f8/script.js';
  const top=()=>{try{if('scrollRestoration' in history)history.scrollRestoration='manual';window.scrollTo(0,0)}catch(e){}};
  // Never let browser history/hash restoration put the landing page halfway down on refresh.
  try{if(location.hash)history.replaceState(null,document.title,location.pathname+location.search);top();requestAnimationFrame(top);window.addEventListener('load',top,{once:true});}catch(e){top()}
  function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
  load(legacy).then(()=>{
    // The older UI script is kept for its stable storefront/cart behavior. Patch its edge cases after boot.
    try{
      const extra={
        badini:{navRitual:'ڕیتواڵ',introLabel:'جیهانەکێ بچووک بۆ هەستەکێ مەزن',introTitle:'مۆم نە تەنێیە.<br><em>رۆناهییا ژیانە.</em>',introText:'هەر دانەیەک ب دەست هاتیە دروستکرن، ب بۆنەکێ کو بیرەوەری دروست دکەت و شێوەیەک کو ل مالا تەدا دژیت.',ritualTitle:'دەمێ مۆم دسوژیت،<br><em>دەم کەمەک راوەستیت.</em>',ritualText:'مۆمێک دابنێ، چرایێن مالێ کەم بکە و بهێلە بۆنەکە مالا تە پڕ بکەت.',step1:'هەڵبژێرە',step2:'داگیرسێنە',step3:'هەست بکە',value1:'مومی پاک',value1p:'Soy Wax و Beeswax ب هەڵبژاردنەکا ورد.',value2:'بۆنێن تایبەت',value2p:'بۆنێن هاوسەنگ بۆ هەستەکا قووڵتر.',value3:'پەکەجینگا جوان',value3p:'ئامادەیە بۆ تە یان کەسەکێ خۆشەویست.',value4:'دروستکریا ناوخۆ',value4p:'ب دەست هاتیە دروستکرن ل کوردستان.'},
        sorani:{navRitual:'ڕیتواڵ',introLabel:'جیهانێکی بچووک بۆ هەستێکی گەورە',introTitle:'مۆم نییە تەنها.<br><em>ڕووناکییەکی ژیانە.</em>',introText:'هەر دانەیەک بە دەست دروست دەکرێت، بە بۆنێک کە بیرەوەری دروست دەکات و شێوەیەک کە لە ماڵەکەتدا دەژیت.',ritualTitle:'کاتێک مۆم دەسووتێت،<br><em>کات کەمێک وەستێت.</em>',ritualText:'مۆمێک دابنێ، چراغەکان کەم بکە و با بۆنەکە ماڵەکەت پڕ بکات.',step1:'هەڵیبژێرە',step2:'داگیرسێنە',step3:'هەست بکە',value1:'مومی پاک',value1p:'Soy Wax و Beeswax بە هەڵبژاردنی ورد.',value2:'بۆنی تایبەت',value2p:'بۆنی هاوسەنگ بۆ هەستی قووڵتر.',value3:'پەکەجینگێکی جوان',value3p:'ئامادەیە بۆ خۆت یان کەسێکی خۆشەویست.',value4:'دروستکراوی ناوخۆ',value4p:'دروستکراو بە دەست لە کوردستان.'},
        arabic:{navRitual:'الطقوس',introLabel:'عالم صغير لإحساس كبير',introTitle:'ليست شمعة فقط.<br><em>إنها ضوء للحياة.</em>',introText:'كل قطعة مصنوعة يدوياً، بعطر يصنع ذكرى وشكل يعيش بأناقة في منزلك.',ritualTitle:'عندما تحترق الشمعة،<br><em>يتوقف الوقت قليلاً.</em>',ritualText:'أشعل شمعة، خفّف الإضاءة ودع العطر يملأ منزلك.',step1:'اخترها',step2:'أشعلها',step3:'استمتع',value1:'شمع نقي',value1p:'شمع الصويا وشمع العسل باختيار دقيق.',value2:'عطور خاصة',value2p:'روائح متوازنة لإحساس أعمق.',value3:'تغليف أنيق',value3p:'جاهز لك أو لمن تحب.',value4:'صناعة محلية',value4p:'مصنوع يدوياً في كردستان.'},
        english:{navRitual:'Ritual',introLabel:'A small world for a bigger feeling',introTitle:'More than a candle.<br><em>A little light for life.</em>',introText:'Every piece is hand-poured with a scent that creates a memory and a form that lives beautifully in your home.',ritualTitle:'When a candle burns,<br><em>time slows down.</em>',ritualText:'Light a candle, soften the lights and let the fragrance fill your home.',step1:'Choose',step2:'Light',step3:'Feel',value1:'Clean wax',value1p:'Soy Wax and Beeswax, carefully selected.',value2:'Signature scents',value2p:'Balanced notes for a deeper feeling.',value3:'Beautiful packaging',value3p:'Ready for you or someone you love.',value4:'Locally made',value4p:'Hand-poured in Kurdistan.'}
      };
      if(typeof dict!=='undefined'){Object.keys(extra).forEach(k=>Object.assign(dict[k],extra[k]))}
      const langSelect=document.querySelector('#language');
      if(langSelect){langSelect.addEventListener('change',()=>{setTimeout(()=>{try{if(typeof renderText==='function')renderText()}catch(e){}},0)})}
      // Make category cards and other labels follow the active language even where old markup used hard-coded English subtitles.
      const applyLanguageExtras=()=>{
        const d=typeof dict!=='undefined'&&typeof lang!=='undefined'?dict[lang]:null;if(!d)return;
        const map={'[data-filter="scented"] small':'catScentedSub','[data-filter="decor"] small':'catDecorSub','[data-filter="gifts"] small':'catGiftsSub'};
        Object.entries(map).forEach(([sel,key])=>{const e=document.querySelector(sel);if(e&&d[key])e.textContent=d[key]});
        document.documentElement.dir=(lang==='english')?'ltr':'rtl';document.documentElement.lang=lang==='english'?'en':lang==='arabic'?'ar':'ku';
      };
      if(langSelect)langSelect.addEventListener('change',()=>setTimeout(applyLanguageExtras,10));applyLanguageExtras();
      // Do not steal focus or scroll when search/filter controls change.
      document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const href=a.getAttribute('href');if(!href||href==='#')return;const target=document.querySelector(href);if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});history.replaceState(null,'',href)}},{capture:true});
    }catch(e){console.warn('Baran compatibility patch:',e)}
  }).catch(err=>console.error('Baran runtime failed to load:',err));
})();